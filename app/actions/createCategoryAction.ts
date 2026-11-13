"use server";

import { pool } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  await requireAdminUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Category  name are required");
  }

  await pool.query(
    "INSERT INTO categories (name) VALUES ($1)",
    [ name]
  );

  revalidatePath("/");
}
