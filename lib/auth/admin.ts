import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function isAdminUser() {
  const user = await currentUser();
  return user?.publicMetadata.role === "admin";
}

export async function requireAdminUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Please sign in to manage the store.");
  }

  if (user.publicMetadata.role !== "admin") {
    throw new Error("Admin access is required.");
  }
}

export async function getAdminApiError() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  if (user.publicMetadata.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  return null;
}
