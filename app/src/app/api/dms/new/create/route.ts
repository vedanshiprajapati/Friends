import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextApiResponse } from "next";

import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  const token = await auth();

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const senderId = token.user.id!!;

  const { username } = await req.json();
  try {
    const receiver = await db.user.findUnique({ where: { username } });

    if (!receiver) {
      return NextResponse.json(
        { message: "user not found!", status: "error" },
        { status: 404 }
      );
    }

    if (receiver?.id === senderId) {
      return NextResponse.json(
        { message: "Sender is the Receiver", status: "error" },
        { status: 402 }
      );
    }

    let conversation = await db.conversation.findFirst({
      where: {
        participants: { every: { id: { in: [senderId, receiver.id] } } },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          participants: { connect: [{ id: senderId }, { id: receiver.id }] },
        },
      });
    }

    return NextResponse.json(
      {
        data: conversation,
        message: "Conversation is created successfully",
        status: "success",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "failed at sending the message request!",
        status: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
