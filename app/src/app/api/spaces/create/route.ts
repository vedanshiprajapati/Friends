import { db } from "@/app/lib/db";
import { NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });

  if (!token || !token.sub) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const userId = token.sub;
  try {
    const { name, description, isPrivate, isRandom, role } = await req.json();
    const image = "/group-image.png";
    const group = await db.space.create({
      data: {
        name,
        description,
        isPrivate,
        isRandom,
        image,
        creatorId: userId,
        members: {
          create: { userId, role: role, isAdmin: true },
        },
      },
    });

    return NextResponse.json(
      {
        data: group,
        status: "success",
        message: "Space is created successfully!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed at Creating a space!",
        error: error.message,
        status: "error",
      },
      { status: 422 }
    );
  }
}
