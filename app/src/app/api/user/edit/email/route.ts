import { db } from "@/app/lib/db";
import { auth } from "@/auth";

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
    const { email } = await req.json();

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
      },
    });

    return NextResponse.json(
      {
        message: "Email changed successfully",
        status: "success",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Unexpected Error has occured",
        status: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
