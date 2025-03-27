"use client";

import React, { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

interface MessageContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  x,
  y,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Close menu when pressing escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Adjust menu position if it would go off-screen
  const adjustedX = Math.min(x, window.innerWidth - 150);
  const adjustedY = Math.min(y, window.innerHeight - 100);

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${adjustedY}px`,
        left: `${adjustedX}px`,
        zIndex: 1000,
      }}
      className="bg-white shadow-lg rounded-md border border-gray-200 py-1 min-w-[150px]"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
      >
        <Trash2 size={16} className="mr-2" />
        Supprimer
      </button>
    </div>
  );
};

export default MessageContextMenu;
