"use client";
import { useState } from "react";
import { LucideIcon } from "lucide-react"; // Import for icons

export default function SettingsPage() {
  const [privateAccount, setPrivateAccount] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-lightCream p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-deepPurple">Settings</h1>
      <p className="text-purple mt-2">
        Manage your account, privacy, and preferences.
      </p>

      {/* Account Settings */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-deepPurple mb-4">
          Account Settings
        </h2>
        {/* Change Password */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-purple">Change Password</h3>
          <form className="mt-4 space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="block w-full rounded-md border border-deepPurple p-2"
            />
            <input
              type="password"
              placeholder="New Password"
              className="block w-full rounded-md border border-deepPurple p-2"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="block w-full rounded-md border border-deepPurple p-2"
            />
            <button className="bg-purple text-white px-4 py-2 rounded-md hover:bg-deepPurple">
              Save Changes
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div>
          <h3 className="text-lg font-medium text-purple">Delete Account</h3>
          <p className="text-sm text-lightPurple1">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
