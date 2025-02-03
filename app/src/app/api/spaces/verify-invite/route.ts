import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { FriendsRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Be liberal in accepting input - try to parse JSON, but handle failures gracefully
    const body = await req.json().catch(() => ({}));
    const inviteCode = body?.inviteCode?.toString();

    // Validate essential inputs
    if (!inviteCode) {
      return NextResponse.json(
        { message: "Invite code is required", status: "error" },
        { status: 400 }
      );
    }

    // Auth check
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json(
        { message: "Unauthorized", status: "error" },
        { status: 401 }
      );
    }

    // Fetch space with members to check roles
    const space = await db.space.findUnique({
      where: { inviteCode },
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
        { message: "Invalid invite code", status: "error" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isMember = space.members.some(
      (member) => member.userId === token.sub
    );

    // Check space capacity
    const isSpaceFull = space.members.length >= 6;

    // Get taken roles
    const takenRoles = space.members.map((member) => member.role);

    // Be conservative in what we send - only return necessary info
    return NextResponse.json({
      status: "success",
      data: {
        spaceId: space.id,
        spaceName: space.name,
        isMember,
        isSpaceFull,
        takenRoles,
        availableRoles: Object.values(FriendsRole).filter(
          (role) => !takenRoles.includes(role)
        ),
      },
    });
  } catch (error: any) {
    console.error("Verify invite error:", error);
    return NextResponse.json(
      { message: "Internal server error", status: "error" },
      { status: 500 }
    );
  }
}
