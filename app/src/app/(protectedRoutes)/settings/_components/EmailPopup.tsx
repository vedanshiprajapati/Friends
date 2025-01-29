import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Email schema
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type FormData = z.infer<typeof emailSchema>;

const EmailPopup = ({
  setShowEmailModal,
}: {
  setShowEmailModal: (value: SetStateAction<boolean>) => void;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/user/edit/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setShowEmailModal(false);
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-md border">
        <h3 className="text-xl font-bold text-deepPurple mb-4">Change Email</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 py-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              New Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple"
              placeholder="Enter new email"
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error instanceof Error
                ? error.message
                : "Failed to update email"}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowEmailModal(false)}
              className=" bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-purple text-white px-2 py-3 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPopup;
