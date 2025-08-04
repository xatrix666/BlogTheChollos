import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Notification({ message, color = "green", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        green: "bg-gradient-to-r from-blue-500 via-green-500 to-teal-400",
        red: "bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400",
    };

    const notificationElement = (
        <div
            className={`${bgColor[color]} text-white px-7 py-4 rounded-xl shadow-2xl text-lg font-semibold flex items-center gap-3 transition-all animate-fade-in-out`}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 10000,
                maxWidth: '400px'
            }}
        >
            {color === "green" && <span className="text-2xl">✅</span>}
            {color === "red" && <span className="text-2xl">⚠️</span>}
            
            <span className="flex-1">{message}</span>
            
            <button
                onClick={onClose}
                aria-label="Cerrar notificación"
                className="text-white hover:text-gray-200 transition-colors ml-2"
            >
                ✖
            </button>
        </div>
    );

    // Renderizar en el body usando createPortal
    return createPortal(notificationElement, document.body);
}
