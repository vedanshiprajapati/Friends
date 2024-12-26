import React from "react";

const ChatMain = () => {
  return (
    <div className="w-3/4 bg-cream p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="text-deepPurple font-semibold">Section 1</h2>
          {/* Dummy data for section 1 */}
        </div>
        <div className="col-span-1">
          <h2 className="text-deepPurple font-semibold">Section 2</h2>
          {/* Dummy data for section 2 */}
        </div>
        <div className="col-span-1">
          <h2 className="text-deepPurple font-semibold">Section 3</h2>
          {/* Dummy data for section 3 */}
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
