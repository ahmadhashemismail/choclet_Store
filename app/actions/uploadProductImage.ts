"use server";

import { createClient } from "@supabase/supabase-js";
import { requireAdminUser } from "@/lib/auth/admin";

export async function uploadProductImage(image: File): Promise<string> {
  await requireAdminUser();
  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensionByType[image.type];

  if (image.size === 0 || !extension || image.size > 5 * 1024 * 1024) {
    throw new Error("Use a JPG, PNG, or WebP image up to 5 MB.");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_Secret_keys;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are missing.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const imagePath = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("choclet_store")
    .upload(imagePath, Buffer.from(await image.arrayBuffer()), {
      contentType: image.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  return supabase.storage.from("choclet_store").getPublicUrl(imagePath).data
    .publicUrl;
}
