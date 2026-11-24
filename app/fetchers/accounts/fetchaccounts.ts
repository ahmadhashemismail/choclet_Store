import { account } from "@/lib/types/account";

export async function GetAccounts(): Promise<account[]> {
  const res = await fetch("/api/accounts", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch accpunts");
  return data;
}

export async function GetaccountById(id: number): Promise<account> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch account");
  return data;
}
