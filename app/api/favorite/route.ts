import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/getacountid";

export async function GET() {
  try {
    const id = await getAccountId();

    if (!id) {
      return NextResponse.json(
        { error: "Please sign in to view your favorites" },
        { status: 401 },
      );
    }

    const res = await pool.query(
      "SELECT product_id FROM favorite WHERE account_id = $1 " ,
      [id]
    );

    return NextResponse.json(res.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return NextResponse.json({ error: "Failed to fetch favorite items" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json(
        { error: "Please sign in to manage your favorites" },
        { status: 401 },
      );
    }

    const { product_id } = await req.json();
    if (!Number.isInteger(product_id) || product_id <= 0) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM favorite WHERE product_id = $1 AND account_id = $2 RETURNING product_id",
      [product_id, accountId],
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    return NextResponse.json({ product_id }, { status: 200 });
  } catch (error) {
    console.error("Error removing favorite item:", error);
    return NextResponse.json({ error: "Failed to remove favorite item" }, { status: 500 });
  }
}