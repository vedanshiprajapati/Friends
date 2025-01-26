import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { FriendsRole } from "@prisma/client";
interface Iparams {
  spaceId: string;
}
export async function POST(
  request: Request,
  context: { params: Promise<Iparams> }
) {
  try {
    const { spaceId } = await context.params;

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // Check if the user is authenticated
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }

    const currentUserId = token.sub;
    const { userId, role } = await request.json();

    // Validate inputs
    if (!spaceId || !userId || !role) {
      return NextResponse.json(
        { message: "Missing required fields!", status: "error" },
        { status: 400 }
      );
    }

    // Validate the role is a valid FriendsRole
    if (!Object.values(FriendsRole).includes(role)) {
      return NextResponse.json(
        {
          message: "Invalid role specified!",
          status: "error",
          data: { yourRole: role, requiredRoles: FriendsRole },
        },
        { status: 400 }
      );
    }

    // Check if the space exists and include members for validation
    const space = await db.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        members: true,
      },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found!", status: "error" },
        { status: 404 }
      );
    }

    // Check if the current user is an admin in the space
    const currentUserMembership = space.members.find(
      (member) => member.userId === currentUserId
    );

    if (!currentUserMembership?.isAdmin) {
      return NextResponse.json(
        {
          message: "You don't have permission to add members!",
          status: "error",
        },
        { status: 403 }
      );
    }

    // Check if the user to be added exists
    const userToAdd = await db.user.findFirst({
      where: { id: userId },
    });

    if (!userToAdd) {
      return NextResponse.json(
        { message: "User not found!", status: "error" },
        { status: 404 }
      );
    }

    // Check if the user is already a member
    const isAlreadyMember = space.members.some(
      (member) => member.userId === userId
    );

    if (isAlreadyMember) {
      return NextResponse.json(
        { message: "User is already a member of this space!", status: "error" },
        { status: 400 }
      );
    }

    // Check if the role is already taken in the space
    const isRoleTaken = space.members.some((member) => member.role === role);

    if (isRoleTaken) {
      return NextResponse.json(
        { message: "This role is already taken!", status: "error" },
        { status: 400 }
      );
    }

    // Check if the space has reached the maximum of 6 members
    if (space.members.length >= 6) {
      return NextResponse.json(
        { message: "Space has reached maximum capacity!", status: "error" },
        { status: 400 }
      );
    }

    // Add the new member
    const newMember = await db.spaceMember.create({
      data: {
        userId,
        spaceId,
        role,
        isAdmin: false, // New members are not admins by default
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Member added successfully!",
        status: "success",
        data: newMember,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in adding member:", error);
    return NextResponse.json(
      {
        message: "Internal server error!",
        status: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
