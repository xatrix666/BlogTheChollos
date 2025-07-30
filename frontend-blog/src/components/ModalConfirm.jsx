import { useEffect } from "react";

export default function ModalConfirm({ message, isOpen, onConfirm, onCancel }) {
  useEffect(() => {
    if (isOpen) {
      // Guarda overflow original de body, html y #root
      const origBody = document.body.style.overflow;
      const origHtml = document.documentElement.style.overflow;
      const origRoot = document.getElementById("root")?.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (document.getElementById("root")) document.getElementById("root").style.overflow = "hidden";
      return () => {
        document.body.style.overflow = origBody;
        document.documentElement.style.overflow = origHtml;
        if (document.getElementById("root")) document.getElementById("root").style.overflow = origRoot || "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition" />
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full">
        <p className="text-lg font-semibold mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
