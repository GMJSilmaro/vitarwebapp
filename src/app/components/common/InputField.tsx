import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string; // Optional, defaults to "text"
  required?: boolean; // Optional, defaults to false
  name?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  name,
  onChange,
  placeholder = "", // Optional placeholder, defaults to empty
  type = "text", // Optional type, defaults to "text"
  required = false, // Optional required flag, defaults to false
}) => (
  <div className="mb-4 xl:mb-6">
    <label
      htmlFor={id}
      className="block mb-2 text-xs xl:text-sm font-bold text-gray-900"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default InputField;
