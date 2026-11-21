import { getAccountId } from "@/lib/auth/getacountid";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accountId = await getAccountId();
  if (!accountId) {
    return NextResponse.json({ error: "Please login" }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  try {
    const res = await pool.query(
      "DELETE FROM cart WHERE product_id = $1 AND account_id = $2 RETURNING *",
      [productId, accountId],
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Product not found in cart" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully from cart" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product in cart:", error);
    return NextResponse.json({ error: "Failed to delete product in cart" }, { status: 500 });
  } 
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accountId = await getAccountId();
  if (!accountId) {
    return NextResponse.json({ error: "Please login" }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  const { quantity } = await req.json();
  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
  }
  try {
    const res = await pool.query(
      "UPDATE cart SET quantity = $1 WHERE product_id = $2 AND account_id = $3 RETURNING *",
      [quantity, productId, accountId],
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating product in cart:", error);
    return NextResponse.json({ error: "Failed to update product in cart" }, { status: 500 });
  }
}