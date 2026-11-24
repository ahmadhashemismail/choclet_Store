import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  const { categoryId: rawCategoryId } = await params;
  const categoryId = Number(rawCategoryId);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

 

  try {
    const result = await pool.query(
      `SELECT * FROM products
       WHERE category_id = $1 
       ORDER BY id`,
      [categoryId],
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch products in this category" },
      { status: 500 },
    );
  }
}
