// /pages/api/groups/basic/route.ts
import { db } from "@/app/lib/db";
import { NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }
  const userId = token?.sub;

  try {
    const spaces = await db.space.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      select: {
        id: true,
        name: true,
        isPrivate: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Data retrieved successfully",
        data: spaces,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to retrieve data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
