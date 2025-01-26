"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CldUploadButton } from "next-cloudinary";
import { useSession } from "next-auth/react";

// Define the schema for form validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  image: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Fetch user info
export const fetchUserInfo = async () => {
  const response = await fetch("/api/user/info");
  return response.json();
};

// Update user info
const updateUserInfo = async (data: ProfileFormData) => {
  const response = await fetch("/api/user/edit", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

const EditProfilePopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageString, setImageString] = useState<string | null>(null);
  const { data: session, update: updateSession } = useSession();
  session?.user;
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
  });

  const Profilemutation = useMutation({
    mutationFn: updateUserInfo,

    onSuccess: async (updatedData) => {
      try {
        // Use the update method with a more precise payload
        console.log("Raw updated data:", updatedData);

        // Log the current session before update
        console.log("Current session before update:", session);
        const updateResult = await updateSession({
          user: {
            name: updatedData.data.name,
            username: updatedData.data.username,
            image: updatedData.data.image,
          },
        });
        // Log the update result
        console.log("Session update result:", updateResult);

        // Log the session after update
        console.log("Session after update attempt:", session);
        // Invalidate and refetch user info
        queryClient.invalidateQueries({
          queryKey: ["userInfo"],
        });

        // Close the popup after successful update
        onClose();
      } catch (error) {
        console.error("Failed to update session", error);
        // Optionally, show a user-friendly error message
        alert("Failed to update profile. Please try again.");
      }
    },
    onError: (error) => {
      console.log("Error updating profile:", error.message);
    },
  });

  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.data.name,
        username: userInfo.data.username,
        image: userInfo.data.image,
      });
      setImagePreview(userInfo.data.image);
    }
  }, [userInfo, reset]);

  const handleUpload = (result: any) => {
    if (!result?.info?.secure_url) {
      alert("Failed to upload the image. Try again!");
      console.log("the result?.info?.secure_url - image url doesnt exist");
      return;
    }
    setImagePreview(result?.info?.secure_url);
    setImageString(result?.info?.secure_url);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (imageString) {
      try {
        data.image = imageString;
      } catch (error: any) {
        console.log("Error uploading image:", error.message);
        alert("Failed to upload image. Please try again.");
        return;
      }
    }
    console.log(data, "DATAA");
    Profilemutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-lightCream w-full max-w-xl rounded-lg m-4 paper border-2 border-lavender">
        {/* Header */}
        <div className="p-4 border-b border-lavender flex justify-between items-center">
          <h2 className="text-2xl font-bold text-deepPurple">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-deepPurple hover:text-purple transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Image and Fields Section */}
          <div className="flex space-x-6">
            {/* Image Upload Section */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <label className="text-sm font-medium text-deepPurple">
                Image
              </label>
              <div className="mt-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                )}
                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 w-1/2 p-2 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                /> */}
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onSuccess={handleUpload}
                  uploadPreset="friendsChat"
                  className="p-2"
                >
                  <p className="text-deepPurple cursor-pointer">Edit Image</p>
                </CldUploadButton>
              </div>
            </div>

            {/* Name and Username Fields */}
            <div className="flex-grow space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-deepPurple">
                  Name
                </label>
                <input
                  {...register("name")}
                  className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Enter your name..."
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deepPurple">
                  Username
                </label>
                <input
                  {...register("username")}
                  className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Enter your username..."
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-deepPurple hover:bg-lavender/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Profilemutation.isPending}
              className="px-4 py-2 bg-purple text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Profilemutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
