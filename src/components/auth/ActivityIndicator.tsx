import React from "react";
import ReactDOM from "react-dom";

const ActivityIndicator = ({ text }: { text?: string }) => {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-[#212121]/70 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      {text && (
        <span className="ml-4 text-white text-sm">{text}</span>
      )}
    </div>,
    document.body
  );
};

export default ActivityIndicator;
