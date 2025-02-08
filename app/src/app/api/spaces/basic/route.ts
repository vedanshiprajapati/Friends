// /pages/api/groups/basic/route.ts
import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextApiResponse } from "next";

import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {
  const token = await auth();

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }
  const userId = token.user.id;

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
