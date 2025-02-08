// /pages/api/groups/detailed.ts
import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";

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
      include: {
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                image: true,
                name: true,
                username: true,
                isPrivate: true,
              },
            },
          },
        },
        messages: {
          take: 1, // Get the most recent message
          orderBy: { createdAt: "desc" },
          select: {
            content: true,
            createdAt: true,
            image: true,
            sender: {
              select: {
                id: true,
                role: true,
                user: {
                  select: {
                    id: true,
                    image: true,
                    name: true,
                    username: true,
                    isPrivate: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // const detailedSpaces = spaces.map((space) => ({
    //   id: space.id,
    //   name: space.name,
    //   lastMessage: space.messages[0] || null,
    // }));

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
