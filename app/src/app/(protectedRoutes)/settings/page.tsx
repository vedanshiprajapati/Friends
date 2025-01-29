"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Lock, Mail, Trash2 } from "lucide-react";
import PasswordPopup from "./_components/PasswordPopup";
import EmailPopup from "./_components/EmailPopup";
import DeleteAccountPopup from "./_components/DeleteAccountPopup";

export default function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await fetch("/api/user/info");
      return response.json();
    },
  });

  const isCredentialUser = data?.data?.password;
  const userData = data?.data;

  // Format date to be more readable
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-lightCream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-deepPurple text-center">
          Settings
        </h1>
        <p className="text-purple mt-2 text-center">
          Manage your account, privacy, and preferences.
        </p>

        {/* Profile Overview */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={userData.image}
                alt={userData.name}
                fill
                className="object-cover rounded-full border-0"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-deepPurple">
                {userData.name}
              </h2>
              <p className="text-purple">@{userData.username}</p>
              <p className="text-gray-600 mt-1">{userData.email}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-lightCream p-4 rounded-lg">
              <p className="text-sm text-purple">Member Since</p>
              <p className="text-deepPurple font-medium">
                {formatDate(userData.createdAt)}
              </p>
            </div>
            <div className="bg-lightCream p-4 rounded-lg">
              <p className="text-sm text-purple">Last Updated</p>
              <p className="text-deepPurple font-medium">
                {formatDate(userData.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-deepPurple mb-6">
            Account Settings
          </h2>

          <div className="space-y-6">
            {/* Only show these options for credential users */}
            {isCredentialUser && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-deepPurple transition-colors flex items-center justify-center gap-2"
                >
                  <Lock />
                  Change Password
                </button>

                <button
                  onClick={() => setShowEmailModal(true)}
                  className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-deepPurple transition-colors flex items-center justify-center gap-2"
                >
                  <Mail />
                  Change Email
                </button>
              </div>
            )}

            {/* Delete Account */}
            <div className="border-t border-purple pt-6 mt-6">
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800">
                  Delete Account
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <button
                  className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordPopup setShowPasswordModal={setShowPasswordModal} />
      )}
      {showDeleteModal && (
        <DeleteAccountPopup setShowDeleteModal={setShowDeleteModal} />
      )}

      {/* Email Change Modal */}
      {showEmailModal && <EmailPopup setShowEmailModal={setShowEmailModal} />}
    </div>
  );
}
