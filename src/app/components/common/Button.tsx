import React from "react";

interface ButtonProps {
  label: string;
  type: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Optional onClick handler
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm sm:text-base shadow-md hover:bg-red-600 transition"
    >
      {label}
    </button>
  );
};

export default Button;
