"use client";

import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [show, setShow] = useState(false);       // controls animation classes
  const [render, setRender] = useState(isOpen);  // controls DOM mount

  useEffect(() => {
    if (isOpen) {
      setRender(true); // mount immediately
      const timeout = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setShow(false); // trigger fade + upward slide
      const timeout = setTimeout(() => setRender(false), 300); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with fade */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal content with fade+scale+slide */}
      <div
        className={`relative bg-white rounded-xl p-10 w-full max-w-4xl z-10 transform transition-all duration-300 ${
          show
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-10"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}