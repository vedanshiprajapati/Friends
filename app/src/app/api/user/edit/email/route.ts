import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }

    const userId = token?.sub;
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
