import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ArrowRight, X } from "lucide-react";
import { SPACE_CHARACTER_IMAGE } from "@/app/_data/constants";
import { FriendsRole } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { spaceSchema } from "@/schemas";
import Image from "next/image";

// Infer the type of the form data from the schema
type SpaceFormData = z.infer<typeof spaceSchema>;

// Define the type for the data expected by postCreateSpace
type CreateSpaceData = {
  name: string;
  description?: string;
  isPrivate: boolean;
  role: FriendsRole;
  isRandom: boolean;
};

// Mock function for posting data (replace with your actual API call)
const postCreateSpace = async (data: CreateSpaceData) => {
  // Simulate an API call
  const response = await fetch("/api/spaces/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create space");
  }

  return response.json();
};

const PopUp = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState(1);
  const route = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      role: FriendsRole.ROSS,
    },
  });
  const queryClient = useQueryClient();
  // UseMutation to handle form submission
  const mutation = useMutation({
    mutationFn: (data: CreateSpaceData) => postCreateSpace(data),
    onSuccess: (data) => {
      onClose(); // Close the popup
      setStep(1); // Reset to the first step
      reset(); // Reset the form
      queryClient.invalidateQueries({
        queryKey: ["BasicSpaceData"],
      });
      const params = new URLSearchParams(searchParams);
      params.delete("conversationId");
      params.set("spaceId", data.data.id);
      route.push(`/chat/space?${params.toString()}`);
    },
    onError: (error) => {
      console.error("Error creating space:", error);
      alert("Failed to create space. Please try again.");
    },
  });

  if (!isOpen) return null;

  // Handle form submission
  const onSubmit = (data: SpaceFormData) => {
    const createSpaceData: CreateSpaceData = {
      ...data,
      isRandom: false,
    };

    // Trigger the mutation
    mutation.mutate(createSpaceData);
  };

  // Handle next step (step 1 to step 2)
  const handleNext = () => {
    const name = watch("name");
    if (name) setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-lightCream w-full max-w-2xl rounded-lg m-4 paper border-2 border-lavender">
        {/* Header */}
        <div className="p-4 border-b border-lavender flex justify-between items-center">
          <h2 className="text-2xl font-bold text-deepPurple">
            {step === 1 ? "New Space" : "Choose Your Role"}
          </h2>
          <button
            type="button" // Ensure this is a button and not a submit
            onClick={onClose}
            className="text-deepPurple hover:text-purple transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Space Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-deepPurple">
                    Space Name
                  </label>
                  <input
                    {...register("name")}
                    className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="Enter space name..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent form submission on Enter
                      }
                    }}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-deepPurple">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple h-24 resize-none"
                    placeholder="Enter space description..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent form submission on Enter
                      }
                    }}
                  />
                  {errors.description && (
                    <span className="text-red-500 text-sm">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                {/* Private Space Toggle */}
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isPrivate")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-lavender peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple"></div>
                  </label>
                  <span className="text-sm font-medium text-deepPurple flex items-center gap-2">
                    Private Space <Lock className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button onClick={onClose} className="px-4 py-2 text-deepPurple">
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  disabled={!watch("name")}
                  className="px-4 py-2 bg-purple text-white flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="p-6 space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-3 gap-4">
                {SPACE_CHARACTER_IMAGE.map((character) => (
                  <div
                    key={character.name}
                    onClick={() =>
                      setValue("role", character.name as FriendsRole)
                    }
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      watch("role") === character.name
                        ? "border-purple bg-lightPurple1"
                        : "border-lavender hover:border-purple"
                    }`}
                  >
                    <div className="aspect-square rounded-lg bg-cream mb-2 flex items-center justify-center">
                      <Image
                        src={character.avatar}
                        height={100}
                        width={100}
                        alt={character.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-deepPurple">
                      {character.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
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
                  disabled={!watch("role") || mutation.isPending}
                  className="px-4 py-2 bg-purple text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Creating..." : "Create Space"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PopUp;
