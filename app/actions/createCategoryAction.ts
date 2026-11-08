"use server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await pool.query(
    "insert into categories (name, description) values ($1, $2)",
    [name, description]
  );

  revalidatePath("/categories");
}
