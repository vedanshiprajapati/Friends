import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ArrowRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FriendsRole } from "@prisma/client";
import { SPACE_CHARACTER_IMAGE } from "@/app/_data/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Types for API responses
type VerifyInviteResponse = {
  spaceId: string;
  spaceName: string;
  takenRoles: FriendsRole[];
  isMember: boolean;
};

type SpaceData = {
  spaceId: string;
  spaceName: string;
  takenRoles: FriendsRole[];
};

// Schemas for each step
const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

const roleSchema = z.object({
  role: z.nativeEnum(FriendsRole, {
    required_error: "Role selection is required",
  }),
});

type InviteCodeFormData = z.infer<typeof inviteCodeSchema>;
type RoleFormData = z.infer<typeof roleSchema>;

// API functions
const verifyInvite = async (inviteCode: string) => {
  const response = await fetch("/api/spaces/verify-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteCode }),
  });
  if (!response.ok) throw new Error("Invalid invite code");
  return response.json();
};

const joinSpace = async ({
  spaceId,
  role,
  userId,
}: {
  spaceId: string;
  role: FriendsRole;
  userId: string;
}) => {
  const response = await fetch(`/api/spaces/individual/${spaceId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role }),
  });
  if (!response.ok) throw new Error("Failed to join space");
  return response.json();
};

const InviteCodePopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  // Form for invite code step
  const inviteForm = useForm<InviteCodeFormData>({
    resolver: zodResolver(inviteCodeSchema),
  });

  // Form for role selection step
  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  // Mutation for verifying invite code
  const verifyMutation = useMutation({
    mutationFn: (data: InviteCodeFormData) => verifyInvite(data.inviteCode),
    onSuccess: (response: any) => {
      if (response.data.isMember) {
        // Show already member view
        setSpaceData({
          spaceId: response.data.spaceId,
          spaceName: response.data.spaceName,
          takenRoles: response.data.takenRoles,
        });
        setStep(3); // Special step for already member
      } else {
        // Move to role selection
        setSpaceData({
          spaceId: response.data.spaceId,
          spaceName: response.data.spaceName,
          takenRoles: response.data.takenRoles,
        });
        setStep(2);
      }
    },
    onError: () => {
      alert("Invalid invite code. Please try again.");
    },
  });

  // Mutation for joining space
  const joinMutation = useMutation({
    mutationFn: (data: RoleFormData) => {
      if (!spaceData) throw new Error("No space data");
      return joinSpace({
        spaceId: spaceData.spaceId,
        role: data.role,
        userId: session.data?.user.id!,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["BasicSpaceData", "DetailedSpaceData"],
      });
      onClose();
      const params = new URLSearchParams(searchParams);
      params.delete("conversationId");
      params.set("spaceId", data.data.id);
      router.push(`/chat/space?${params.toString()}`);
    },
    onError: () => {
      alert("Failed to join space. Please try again.");
    },
  });

  if (!isOpen) return null;

  // Handle closing and resetting
  const handleClose = () => {
    setStep(1);
    setSpaceData(null);
    inviteForm.reset();
    roleForm.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-lightCream w-full max-w-2xl rounded-lg m-4 paper border-2 border-lavender">
        {/* Header */}
        <div className="p-4 border-b border-lavender flex justify-between items-center">
          <h2 className="text-2xl font-bold text-deepPurple">
            {step === 1
              ? "Add the Invite Code"
              : step === 2
              ? "Choose Your Role"
              : "Already a Member"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-deepPurple hover:text-purple transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step 1: Invite Code */}
        {step === 1 && (
          <form
            onSubmit={inviteForm.handleSubmit((data) =>
              verifyMutation.mutate(data)
            )}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <input
                    {...inviteForm.register("inviteCode")}
                    className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="Enter invite code..."
                  />
                  {inviteForm.formState.errors.inviteCode && (
                    <span className="text-red-500 text-sm">
                      {inviteForm.formState.errors.inviteCode.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-deepPurple hover:bg-lavender/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !inviteForm.watch("inviteCode") || verifyMutation.isPending
                  }
                  className="px-4 py-2 bg-purple text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyMutation.isPending ? (
                    "Verifying..."
                  ) : (
                    <>
                      Next <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && spaceData && (
          <form
            onSubmit={roleForm.handleSubmit((data) =>
              joinMutation.mutate(data)
            )}
          >
            <div className="p-6 space-y-6">
              <p className="text-deepPurple">
                Joining:{" "}
                <span className="font-semibold">{spaceData.spaceName}</span>
              </p>

              <div className="grid grid-cols-3 gap-4">
                {SPACE_CHARACTER_IMAGE.map((character) => {
                  const isRoleTaken = spaceData?.takenRoles?.includes(
                    character.name as FriendsRole
                  );
                  return (
                    <div
                      key={character.name}
                      onClick={() => {
                        if (!isRoleTaken) {
                          roleForm.setValue(
                            "role",
                            character.name as FriendsRole
                          );
                        }
                      }}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        isRoleTaken
                          ? "opacity-50 cursor-not-allowed border-gray-300"
                          : roleForm.watch("role") === character.name
                          ? "border-purple bg-lightPurple1 cursor-pointer"
                          : "border-lavender hover:border-purple cursor-pointer"
                      }`}
                    >
                      <div className="aspect-square rounded-lg bg-cream mb-2 flex items-center justify-center">
                        <Image
                          src={character.avatar}
                          width={100}
                          height={100}
                          alt={character.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-center text-sm font-medium text-deepPurple">
                        {character.name}
                        {isRoleTaken && " (Taken)"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-deepPurple hover:bg-lavender/20 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!roleForm.watch("role") || joinMutation.isPending}
                  className="px-4 py-2 bg-purple text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joinMutation.isPending ? "Joining..." : "Enter"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Already Member View */}
        {step === 3 && spaceData && (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <p className="text-deepPurple">
                You are already a member of{" "}
                <span className="font-semibold">{spaceData.spaceName}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const params = new URLSearchParams(searchParams);
                  params.delete("conversationId");
                  params.set("spaceId", spaceData.spaceId);
                  router.push(`/chat/space?${params.toString()}`);
                }}
                className="px-4 py-2 bg-purple text-white rounded-lg"
              >
                Go to Space
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteCodePopup;
