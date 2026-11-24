import { pool } from "@/lib/db";
import { getAccountId } from "@/lib/auth/getacountid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Please login to add items to your favorite" }, { status: 401 });
    }

    const { product_id } = await req.json();

    if (!Number.isInteger(product_id) || product_id <= 0) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const existing = await pool.query(
      "SELECT product_id FROM favorite WHERE product_id = $1 AND account_id = $2",
      [product_id, accountId],
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(existing.rows[0], { status: 200 });
    }

    const result = await pool.query(
      "INSERT INTO favorite (product_id, account_id) VALUES ($1, $2) RETURNING *",
      [product_id, accountId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add the product into favorite" }, { status: 500 });
  }
}
