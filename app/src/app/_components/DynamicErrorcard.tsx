import React from "react";
import { AlertCircle } from "lucide-react";

const DynamicErrorCard = ({ message = "Could this BE any more broken?" }) => {
  return (
    <div className="max-w-md rounded-lg bg-gradient-to-r from-[#fcf8f2] to-[#f7efe5] p-4 shadow-lg border border-[#e2bfd9]">
      <div className="flex items-center space-x-3 mb-3">
        <AlertCircle className="h-6 w-6 text-[#674188]" />
        <h3 className="font-bold text-[#674188]">OH. MY. GAWD!</h3>
      </div>

      <div className="bg-[#f0e8fa] rounded-md p-3 text-[#674188]">
        <p className="font-medium">{message}</p>
      </div>

      <p className="mt-3 text-sm text-[#674188] italic">
        {"(In Chandler's voice): "}
        {message === "Could this BE any more broken?"
          ? "Could this BE any more broken?"
          : "We were NOT expecting that!"}
      </p>
    </div>
  );
};

export default DynamicErrorCard;
