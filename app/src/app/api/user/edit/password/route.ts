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
    const { password, confirmPassword } = await req.json();

    if (password != confirmPassword) {
      return NextResponse.json(
        {
          message: "Password and confirm Password are not same",
          status: "error",
        },
        { status: 500 }
      );
    }

    const userInfo = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (userInfo?.password === password) {
      return NextResponse.json(
        {
          message: "Previous Password and New Password can not be same",
          status: "error",
        },
        { status: 500 }
      );
    }

    const updatedInfo = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: password,
      },
    });
    return NextResponse.json(
      {
        message: "Password changed successfully",
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
