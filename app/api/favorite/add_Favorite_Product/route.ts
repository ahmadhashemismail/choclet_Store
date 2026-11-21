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

    if (!product_id) {
      return NextResponse.json({ error: "There is no product" }, { status: 400 });
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