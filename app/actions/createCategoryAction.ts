"use server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const type = formData.get("type") as string;
  const name = formData.get("name") as string;

  await pool.query(
    "insert into categories (type, name) values ($1, $2)",
    [type, name]
  );

  revalidatePath("/categories");
}
