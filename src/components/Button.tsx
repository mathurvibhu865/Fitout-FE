import React from "react";

interface ButtonProps {
  label: string;
  variant?: "solid" | "outline" | "gray-outline";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string; // ✅ Add this line
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "solid",
  onClick,
  type = "button",
  disabled = false,
  className = "", // ✅ Default value
}) => {
  let baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm ";
  let variantStyles = "";

  if (variant === "solid") {
    variantStyles = " text-gray-500 border-gray-400 ";
  } else if (variant === "outline") {
    variantStyles = "border border-gray-400 text-gray-700";
  } else if (variant === "gray-outline") {
    variantStyles = "bg-white border border-gray-400 text-gray-700";
  }

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
