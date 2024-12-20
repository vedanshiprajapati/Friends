import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required / Invalid email" }),

  // changing zod validation error message on the schema
  // email: z.string().email({message: "Email is required"}), // message - only avail on 2nd & chain onwards
  // email: z.string(invalid_type_error: "Must be a string").email(), // invalid_type_error - avail on first chain

  password: z.string().min(1, { message: "Password is required" }),
  // not recommended to limit pword length for login above 1 since required min length may change and old passwords may have old min lengths
  // okay to add .min() to password for RegisterSchema

  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is required / Invalid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

// for future use when i add react-hook-form
export const StrictLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email is required / Invalid email" })
    .min(5, { message: "Email must be at least 5 characters long" }),

  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(128, { message: "Password must be no longer than 128 characters" }),

  code: z.optional(
    z.string().length(6, { message: "Code must be exactly 6 characters" })
  ),
});

// for future use when i add react-hook-form
export const StrictRegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email is required / Invalid email" })
    .min(5, { message: "Email must be at least 5 characters long" }),

  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(128, { message: "Password must be no longer than 128 characters" })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must include at least one number" })
    .regex(/[\W_]/, {
      message: "Password must include at least one special character",
    }),

  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be no longer than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must only contain alphabets and spaces",
    }),
});

// export const ResetSchema = z.object({
//   email: z.string().email({ message: "Email is required / Invalid email" }),
// });

// export const NewPasswordSchema = z.object({
//   password: z.string().min(6, { message: "Minimum 6 characters required" }),
// });

// export const SettingsSchema = z
//   .object({
//     name: z.optional(z.string()),
//     isTwoFactorEnabled: z.optional(z.boolean()),
//     role: z.enum([UserRole.ADMIN, UserRole.USER]),
//     email: z.optional(z.string().email({ message: "Invalid email" })),
//     password: z.optional(z.string().min(6)),
//     newPassword: z.optional(z.string().min(6)),
//   })
//   .refine(
//     (data) => {
//       if (data.password && !data.newPassword) {
//         return false;
//       }

//       return true;
//     },
//     { message: "New password is required!", path: ["newPassword"] },
//   )
//   .refine(
//     (data) => {
//       if (!data.password && data.newPassword) {
//         return false;
//       }

//       return true;
//     },
//     { message: "Password is required!", path: ["password"] },
//   );

// alternative: but you can only write one error message per path
// .refine(
//   (data) => {
//     // ensure both fields have form values if either one is present
//     if (data.password && !data.newPassword) {
//       return false;
//     }

//     if (data.newPassword && !data.password) {
//       return false;
//     }

//     return true;
//   },
//   { message: "New password is required!", path: ["newPassword"] },
// );
