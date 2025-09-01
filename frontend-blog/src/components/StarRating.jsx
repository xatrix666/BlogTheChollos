import { useState } from "react";

export default function StarRating({ 
  value = 0, 
  onRate, 
  disabled = false, 
  showValue = false,
  size = "text-2xl" 
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onRate && onRate(star)}
          className={`p-1 bg-transparent border-none outline-none transition-all ${
            disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          disabled={disabled}
        >
          <span 
            className={`${size} transition-colors ${
              star <= (hovered || value) 
                ? 'text-yellow-400 drop-shadow-sm' 
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-semibold text-gray-600">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}
