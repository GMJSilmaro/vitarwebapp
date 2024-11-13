import React from "react";

interface DisabledFieldProps {
  id: string;
  label: string;
  value: string; // Add value as a prop
  placeholder?: string;
}

const DisabledField: React.FC<DisabledFieldProps> = ({
  id,
  label,
  value, // Destructure the value prop
  placeholder,
}) => (
  <div className="xl:mb-6">
    <label
      htmlFor={id}
      className="block mb-2 text-xs xl:text-sm font-bold text-gray-900"
    >
      {label}
    </label>
    <input
      type="text"
      id={id}
      className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      value={value} // Set the value of the input
      placeholder={placeholder}
      disabled
    />
  </div>
);

export default DisabledField;
