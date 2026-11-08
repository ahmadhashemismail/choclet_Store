"use server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryValue = formData.get("category_id") as string | null;
  const categoryId = categoryValue ? Number(categoryValue) : null;

  await pool.query(
    "insert into products (name, price, description, category_id) values ($1, $2, $3, $4)",
    [name, price, description, categoryId]
  );

  revalidatePath("/products");
}
