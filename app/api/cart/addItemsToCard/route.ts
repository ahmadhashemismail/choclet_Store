import { pool } from "@/lib/db";
import { getAccountId } from "@/lib/auth/getacountid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Please login to add items to your cart" }, { status: 401 });
    }

    const { product_id, quantity = 1 } = await req.json();

    if (!product_id) {
      return NextResponse.json({ error: "There is no product" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO cart (product_id, account_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (account_id, product_id)
       DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
       RETURNING product_id, quantity`,
      [product_id, accountId, quantity]
    );



    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add the product into cart" }, { status: 500 });
  }
}