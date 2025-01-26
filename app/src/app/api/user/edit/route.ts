import { db } from "@/app/lib/db";
import { NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }
    const userId = token?.sub;

    const { username, name, image } = await req.json();

    if (!username || !name || !image) {
      console.log("failed here");
      return NextResponse.json(
        { message: "Missing required fields!", status: "error" },
        { status: 400 }
      );
    }

    const userInfo = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        username: username,
        name: name,

        image: image,
      },
    });

    return NextResponse.json(
      {
        message: "Data Updated Sucessfully!",
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
