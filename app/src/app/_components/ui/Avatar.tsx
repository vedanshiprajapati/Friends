import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string | null;
  fallback?: string | null;
  size?: number; // Default size is 40
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback = "?",
  size = 40,
}) => {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-deepPurple flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-cream font-medium ">
          {fallback && fallback[0].toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default Avatar;
