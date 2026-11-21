import { auth, currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

export async function getAuthState() {
  const { userId } = await auth();
  if (!userId) return { userId: null, accountId: null };

  const existing = await pool.query(
    "SELECT id FROM accounts WHERE account_id = $1",
    [userId],
  );
  if (existing.rows[0]) {
    return { userId, accountId: existing.rows[0].id };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;
  if (!email) return { userId, accountId: null };

  const name = user?.fullName || user?.firstName || email.split("@")[0];
  const linked = await pool.query(
      "UPDATE accounts SET account_id = $1, name = $2 WHERE email = $3 RETURNING id",
    [userId, name, email],
  );
  if (linked.rows[0]) {
    return { userId, accountId: linked.rows[0].id };
  }

  const account = await pool.query(
      "INSERT INTO accounts (name, email, account_id) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET account_id = EXCLUDED.account_id, name = EXCLUDED.name RETURNING id",
    [name, email, userId],
  );
  return { userId, accountId: account.rows[0]?.id ?? null };
}

export async function getAccountId() {
  const { accountId } = await getAuthState();
  return accountId;
}