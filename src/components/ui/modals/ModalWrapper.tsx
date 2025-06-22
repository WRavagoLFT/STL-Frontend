"use client";

import React, { ReactNode } from "react";
import ExtIconButton from "../icons/ExitButton";

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
  // useEffect(() => {
  //   function onKeyDown(e: KeyboardEvent) {
  //     if (e.key === "Escape") {
  //       onClose();
  //     }
  //   }
  //   if (isOpen) {
  //     window.addEventListener("keydown", onKeyDown);
  //   }
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-[#F8F0E3] rounded-lg shadow-lg w-full 
             max-w-[90%] sm:max-w-[80%] md:max-w-[600px] 
             lg:max-w-[650px] xl:max-w-[720px] 
             max-h-[90vh] overflow-y-auto sidebar-scrollbar p-8 scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end leading-none !-mt-2 !-mr-2">
            <ExtIconButton
              bgColor="#0038A8"
              hoverColor="#004ccf"
              iconColor="#fff"
              size={25}
              onClick={onClose}
              paddingLeft="0px"
            />
          </div>
          {title && (
            <h3 className="text-2xl font-bold pb-4 leading-none">{title}</h3>
          )}
          <div>{children}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalWrapper;
