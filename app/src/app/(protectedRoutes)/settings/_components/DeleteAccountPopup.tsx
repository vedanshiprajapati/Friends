"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { AlertTriangle, Loader } from "lucide-react";

interface DeleteAccountPopupProps {
  setShowDeleteModal: (show: boolean) => void;
}

export default function DeleteAccountPopup({
  setShowDeleteModal,
}: DeleteAccountPopupProps) {
  const queryClient = useQueryClient();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      return response.json();
    },
    onSuccess: async () => {
      queryClient.clear(); // Clear all queries
      await signOut({ callbackUrl: "/" }); // Redirect to home page after signout
    },
  });

  const handleDelete = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
    } catch (error) {
      console.log("Error deleting account:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-lightCream rounded-lg p-6 max-w-md w-full mx-4 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-deepPurple mb-4">
            Delete Account
          </h2>
          <p className="text-purple mb-6">
            Are you absolutely sure you want to delete your account? This action
            cannot be undone. All your data will be permanently removed.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2 rounded-lg bg-cream text-deepPurple hover:bg-lavender transition-colors"
              disabled={deleteAccountMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteAccountMutation.isPending}
              className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <Loader className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
