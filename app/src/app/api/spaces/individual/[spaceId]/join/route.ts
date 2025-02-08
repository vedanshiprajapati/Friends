import { db } from "@/app/lib/db";

import { NextResponse } from "next/server";
import { FriendsRole } from "@prisma/client";
import { auth } from "@/auth";

interface Params {
  spaceId: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
  try {
    const spaceId = params.spaceId;
    const body = await request.json().catch(() => ({}));
    const role = body?.role?.toString();

    // Validate inputs
    if (!spaceId || !role) {
      return NextResponse.json(
        { message: "Missing required fields", status: "error" },
        { status: 400 }
      );
    }

    // Auth check
    const token = await auth();
    if (!token || !token.user.id) {
      return NextResponse.json(
        { message: "Unauthorized", status: "error" },
        { status: 401 }
      );
    }
    const currentUserId = token.user.id;
    // Validate role
    if (!Object.values(FriendsRole).includes(role as FriendsRole)) {
      return NextResponse.json(
        { message: "Invalid role", status: "error" },
        { status: 400 }
      );
    }

    // Fetch space with members for validation
    const space = await db.space.findUnique({
      where: { id: spaceId },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found", status: "error" },
        { status: 404 }
      );
    }

    // Recheck important conditions
    const isAlreadyMember = space.members.some(
      (member) => member.userId === token.user.id
    );
    const isRoleTaken = space.members.some((member) => member.role === role);
    const isSpaceFull = space.members.length >= 6;

    if (isAlreadyMember) {
      return NextResponse.json(
        { message: "Already a member", status: "error" },
        { status: 409 }
      );
    }

    if (isRoleTaken) {
      return NextResponse.json(
        { message: "Role already taken", status: "error" },
        { status: 409 }
      );
    }

    if (isSpaceFull) {
      return NextResponse.json(
        { message: "Space is full", status: "error" },
        { status: 400 }
      );
    }

    // Create new member
    const newMember = await db.spaceMember.create({
      data: {
        userId: currentUserId,
        spaceId,
        role: role as FriendsRole,
        isAdmin: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Be conservative in response - only return necessary data
    return NextResponse.json({
      status: "success",
      data: {
        memberId: newMember.id,
        spaceId: newMember.spaceId,
        role: newMember.role,
        user: newMember.user,
      },
    });
  } catch (error: any) {
    console.error("Join space error:", error);
    return NextResponse.json(
      { message: "Internal server error", status: "error" },
      { status: 500 }
    );
  }
}
