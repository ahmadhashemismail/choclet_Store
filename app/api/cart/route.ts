import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/getacountid";

export async function GET() {
  try {
    const id = await getAccountId();

    if (!id) {
      return NextResponse.json({ error: "Account not found" }, { status: 401 });
    }

    const res = await pool.query(
      "SELECT product_id, quantity FROM cart WHERE account_id = $1 " ,
      [id]
    );

    return NextResponse.json(res.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}