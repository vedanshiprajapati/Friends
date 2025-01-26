// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { X } from "lucide-react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

// // Define the schema for form validation
// const profileSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   username: z.string().min(1, "Username is required"),
//   image: z.string().optional(),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;

// // Fetch user info
// const fetchUserInfo = async () => {
//   const response = await fetch("/api/user/info");
//   if (!response.ok) {
//     throw new Error("Failed to fetch user info");
//   }
//   return response.json();
// };

// // Update user info
// const updateUserInfo = async (data: ProfileFormData) => {
//   const response = await fetch("/api/user/edit", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to update user info");
//   }

//   return response.json();
// };

// const EditProfilePopup = ({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const queryClient = useQueryClient();
//   const { data: userInfo } = useQuery({
//     queryKey: ["userInfo"],
//     queryFn: fetchUserInfo,
//   });

//   const Profilemutation = useMutation({
//     mutationFn: updateUserInfo,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["userInfo"]);
//       onClose();
//     },
//     onError: (error) => {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile. Please try again.");
//     },
//   });

//   useEffect(() => {
//     if (userInfo) {
//       reset({
//         name: userInfo.data.name,
//         username: userInfo.data.username,
//         image: userInfo.data.image,
//       });
//       setImagePreview(userInfo.data.image);
//     }
//   }, [userInfo, reset]);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const uploadImage = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

//     const response = await fetch(
//       "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to upload image");
//     }

//     const data = await response.json();
//     return data.secure_url;
//   };

//   const onSubmit = async (data: ProfileFormData) => {
//     if (imageFile) {
//       try {
//         const imageUrl = await uploadImage(imageFile);
//         data.image = imageUrl;
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         alert("Failed to upload image. Please try again.");
//         return;
//       }
//     }

//     Profilemutation.mutate(data);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-lightCream w-full max-w-md rounded-lg m-4 paper border-2 border-lavender">
//         {/* Header */}
//         <div className="p-4 border-b border-lavender flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-deepPurple">Edit Profile</h2>
//           <button
//             type="button"
//             onClick={onClose}
//             className="text-deepPurple hover:text-purple transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
//           {/* Image Upload */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-deepPurple">Image</label>
//             <div className="flex items-center space-x-4">
//               {imagePreview && (
//                 <img
//                   src={imagePreview}
//                   alt="Profile Preview"
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
//               />
//             </div>
//           </div>

//           {/* Name Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-deepPurple">Name</label>
//             <input
//               {...register("name")}
//               className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
//               placeholder="Enter your name..."
//             />
//             {errors.name && (
//               <span className="text-red-500 text-sm">
//                 {errors.name.message}
//               </span>
//             )}
//           </div>

//           {/* Username Field */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-deepPurple">
//               Username
//             </label>
//             <input
//               {...register("username")}
//               className="w-full p-3 rounded-lg border border-lavender bg-white focus:outline-none focus:ring-2 focus:ring-purple"
//               placeholder="Enter your username..."
//             />
//             {errors.username && (
//               <span className="text-red-500 text-sm">
//                 {errors.username.message}
//               </span>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-deepPurple hover:bg-lavender/20 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={Profilemutation.isPending}
//               className="px-4 py-2 bg-purple text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {Profilemutation.isPending ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfilePopup;
