import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  try {
    const res = await pool.query("SELECT * FROM products WHERE category_id = $1", [categoryId]);
    return NextResponse.json(res.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
