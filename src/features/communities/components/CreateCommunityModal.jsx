import { FaTimes } from "react-icons/fa";
import CreateCommunityForm from "./CreateCommunityForm";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function CreateCommunityModal({ isOpen, onClose, communityToEdit = null }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] animate-in zoom-in-95 fade-in duration-300">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/30 px-8 py-5">
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            {communityToEdit ? "Modify Community" : "Establish Community"}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-800 hover:text-slate-200 active:scale-90"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-8">
          <CreateCommunityForm 
            onSuccess={onClose} 
            initialData={communityToEdit} 
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
