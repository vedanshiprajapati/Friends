import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextApiResponse } from "next";

import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {
  try {
    const token = await auth();

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }
    const userId = token.user.id;

    const userInfo = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      {
        message: "Data retrieved Successfully",
        data: userInfo,
        status: "success",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "something went Wrong!",
        status: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
