"use server";
import { pool } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
  import { createClient } from "@supabase/supabase-js";
export async function createProductAction(formData: FormData) {
  await requireAdminUser();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryValue = String(formData.get("category_id") ?? "");
  const categoryId = categoryValue === "" ? null : Number(categoryValue);

  if (
    !name.trim() ||
    !description.trim() ||
    !Number.isFinite(price) ||
    price < 0 ||
    (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0))
  ) {
    throw new Error("Invalid product data");
  }


// Inside createProductAction, before the database INSERT:
const image = formData.get("image_url");

if (!(image instanceof File) || image.size === 0) {
  throw new Error("Please choose a product image.");
}

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const extension = extensionByType[image.type];

if (!extension || image.size > 5 * 1024 * 1024) {
  throw new Error("Use a JPG, PNG, or WebP image up to 5 MB.");
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_Secret_keys;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const imagePath = `${crypto.randomUUID()}.${extension}`;

const { error: uploadError } = await supabase.storage
  .from("choclet_store")
  .upload(imagePath, Buffer.from(await image.arrayBuffer()), {
    contentType: image.type,
    upsert: false,
  });

if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

const { data } = supabase.storage
  .from("choclet_store")
  .getPublicUrl(imagePath);

const image_url = data.publicUrl;

  await pool.query(
    "INSERT INTO products (name, price, description, category_id ,image_url) VALUES ($1, $2, $3, $4,$5)",
    [name.trim(), price, description.trim(), categoryId,image_url]
  );

  revalidatePath("/");
  revalidatePath("/products");
}
