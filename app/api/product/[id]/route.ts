import { pool } from "@/lib/db";
import { getAdminApiError } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number(productId) || productId <= 0) {
    return NextResponse.json({ error: "Invalid product id  13" }, { status: 400 });
  }

  try {
    const res = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await getAdminApiError();
  if (authError) return authError;

  const { id } = await params;
  const productId = Number(id);
  try {
    const res = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [productId]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  } 
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await getAdminApiError();
  if (authError) return authError;

  const { id } = await params;
  const productId = Number(id);
  const { name, description, price, category_id ,image_url } = await req.json();
  try {
    const res = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, image_url =$5 WHERE id = $6 RETURNING *",
      [name, description, price, category_id,image_url, productId ]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
