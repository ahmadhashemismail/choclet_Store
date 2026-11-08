"use server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  await pool.query(
    "insert into products (name, price, description) values ($1, $2, $3)",
    [name, price, description]
  );

  revalidatePath("/products"); 
}