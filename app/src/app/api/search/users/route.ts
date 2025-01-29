// app/api/search/user/route.ts
import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }

    const users = await db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                username: {
                  contains: username,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: username,
                  mode: "insensitive",
                },
              },
            ],
          },
          {
            id: {
              not: session.user.id, // Exclude current user
            },
            isPrivate: false, // Only show non-private profiles
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      take: 10, // Limit results
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("USER_SEARCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
