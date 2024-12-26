import React from "react";

interface ScrollAreaProps {
  children: React.ReactNode;
  height?: string | number; // Set a max height if needed
  className?: string; // Additional custom styles
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  height = "200px",
  className,
}) => {
  return (
    <div
      className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ${className}`}
      style={{ maxHeight: height }}
    >
      {children}
    </div>
  );
};

export default ScrollArea;
