import React, { useState } from "react";

interface TagInputProps {
  id: string;
  name: string;
  label: string;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder: string;
}

const TagInput: React.FC<TagInputProps> = ({
  id,
  name,
  label,
  skills,
  onSkillsChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      const newSkills = [...skills, inputValue.trim()];
      onSkillsChange(newSkills);
      setInputValue(""); // Clear the input
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove);
    onSkillsChange(newSkills);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-bold text-black mb-2">
        {label}
      </label>
      <div className="flex flex-wrap border border-gray-300 rounded-md p-2 text-black">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-red-200 text-red-800 py-1 px-2 rounded-full mr-2 mb-2 flex items-center"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 text-red-600"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-none outline-none"
        />
      </div>
    </div>
  );
};

export default TagInput;
