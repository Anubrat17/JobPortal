import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-20 h-20 border-8 rounded-full animate-spin"
        style={{
          borderColor: "#E5E7EB",      
          borderTopColor: "#60A5FA",  
        }}
      ></div>
    </div>
  );
};

export default Loading;

