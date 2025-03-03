import { db } from "@/app/lib/db";
import { auth, signOut } from "@/auth";

import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const token = await auth();

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }
    const userId = token.user.id;

    // Delete all user-related data
    await db.$transaction([
      // Delete user's account
      db.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
