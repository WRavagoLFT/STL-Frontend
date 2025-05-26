import React, { ReactNode, useEffect } from "react";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // Close on ESC key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-[#F8F0E3] rounded-lg shadow-lg w-full 
             max-w-[90%] sm:max-w-[80%] md:max-w-[600px] 
             lg:max-w-[650px] xl:max-w-[725px] 
             max-h-[90vh] overflow-auto p-9"
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex justify-between items-center pb-5">
              <h3 className="text-2xl font-bold">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Close modal"
              >
                &#10005;
              </button>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default ModalWrapper;
