import React, { ReactNode } from "react";

interface ModelProp {
  setIsOpen: (isOpen: boolean) => void;
  body: ReactNode;
}

const Modal: React.FC<ModelProp> = ({ setIsOpen, body }) => {
  return (
    <div
      className="fixed inset-0 bg-neutral-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {body}
      </div>
    </div>
  );
};

export default Modal;
