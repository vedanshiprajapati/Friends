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
    const dms = await db.directMessage.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      distinct: ["conversationId"], // Get only unique conversations
      select: {
        conversationId: true,
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const minimalDMs = dms.map((dm) => ({
      id: dm.conversationId,
      user: dm.receiver?.id === userId ? dm.sender : dm.receiver, // Opposite user
    }));

    return NextResponse.json(
      {
        status: "success",
        message: "Data retrieved successfully",
        data: minimalDMs,
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
