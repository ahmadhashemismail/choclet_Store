import { pool } from "@/lib/db";
import { getAdminApiError } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

export async function GETAccountById(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const account_Id = Number(id);

  if (!Number(account_Id)) {
    return NextResponse.json({ error: "Invalid product id " }, { status: 400 });
  }

  try {
    const res = await pool.query("SELECT * FROM accounts WHERE id = $1", [account_Id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function DELETEAccount(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await getAdminApiError();
  if (authError) return authError;

  const { id } = await params;
  const account_Id = Number(id);
  try {
    const res = await pool.query("DELETE FROM accounts WHERE id = $1 RETURNING *", [account_Id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "account not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "acount deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  } 
}