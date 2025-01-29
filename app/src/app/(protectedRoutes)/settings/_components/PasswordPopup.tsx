import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeClosed } from "lucide-react";

// Password schema with strong validation
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof passwordSchema>;

const PasswordPopup = ({
  setShowPasswordModal,
}: {
  setShowPasswordModal: (value: SetStateAction<boolean>) => void;
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/user/edit/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      return response.json();
    },
    onSuccess: () => {
      reset();
      setShowPasswordModal(false);
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const PasswordInput = ({
    id,
    label,
    show,
    setShow,
    ...props
  }: {
    id: string;
    label: string;
    show: boolean;
    setShow: (show: boolean) => void;
    [key: string]: any;
  }) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={id}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple pr-10"
          {...props}
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeClosed /> : <Eye />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-md border">
        <h3 className="text-xl font-bold text-deepPurple mb-4">
          Change Password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 py-5">
          <PasswordInput
            id="currentPassword"
            label="Current Password"
            show={showCurrentPassword}
            setShow={setShowCurrentPassword}
            placeholder="Enter current password"
            disabled={isPending}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}

          <PasswordInput
            id="newPassword"
            label="New Password"
            show={showNewPassword}
            setShow={setShowNewPassword}
            placeholder="Enter new password"
            disabled={isPending}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            placeholder="Confirm new password"
            disabled={isPending}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          {error && (
            <div className="text-red-500 text-sm">
              {error instanceof Error
                ? error.message
                : "Failed to update password"}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple text-white px-2 py-3 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPopup;
