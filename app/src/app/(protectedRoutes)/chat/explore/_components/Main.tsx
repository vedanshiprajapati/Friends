"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import DmChatBox from "../../dm/_components/DmChatBox";
import Loader from "@/app/_components/Loader";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";
import Image from "next/image";

const ExplorePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  // Search users query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["searchUsers", debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return [];
      const res = await fetch(`/api/search/users?username=${debouncedTerm}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedTerm.length > 0,
  });

  // Create conversation mutation
  const createConversation = useMutation({
    mutationFn: async (username: string) => {
      const res = await fetch("/api/dms/new/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log("Conversation created:", data);
      setSelectedUser(data.data.id);
      queryClient.invalidateQueries({
        queryKey: ["DetailedDmData", "BasicDmData"],
      });
    },
    onError: (error) => {
      console.log("Error creating conversation:", error);
      // Optionally add error handling UI
    },
  });

  const handleUserSelect = (username: string) => {
    createConversation.mutate(username);
  };

  return (
    <div className="flex h-full bg-lightCream gap-3">
      <div className="w-1/3 border-lavender rounded-t-xl border-y border-x flex flex-col">
        <div className="p-4 h-14 border-b rounded-t-2xl border-lavender bg-white">
          <p className="text-lg font-medium">Explore</p>
        </div>
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 rounded-lg border-2 border-lavender focus:outline-none focus:border-deepPurple"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-deepPurple" size={24} />
            </div>
          )}
          {!isLoading && !searchResults && (
            <div className="flex flex-col justify-center items-center h-full -mt-16">
              <p className="text-lg font-medium mb-2">Find your Friends!</p>
              <p className="text-sm">
                Search and select a user to start a conversation
              </p>
            </div>
          )}
          {!isLoading &&
            searchResults?.map((user: any) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user.username)}
                className="p-3 cursor-pointer transition-all duration-200 flex items-center gap-3 hover:bg-lightPurple2"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    height={100}
                    width={100}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-deepPurple/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-deepPurple">
                      {(user.name || user.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
            ))}

          {!isLoading && searchTerm && searchResults?.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <p className="text-center">No users found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white">
        {createConversation.isError && (
          <DynamicErrorCard message={createConversation.error.message} />
        )}
        {createConversation.isPending ? (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : selectedUser ? (
          <DmChatBox id={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-deepPurple/60">
              <p className="text-lg font-medium mb-2">
                No conversation selected
              </p>
              <p className="text-sm">
                enter the username of your friends in the search input to
                message.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
