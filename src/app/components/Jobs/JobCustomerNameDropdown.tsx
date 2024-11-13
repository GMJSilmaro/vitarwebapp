import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

interface SearchDropdownProps {
  label: string;
  placeholder: string;
  collectionName: string; // Collection name to fetch data from Firestore
  value: string; // Current selected value
  onOptionSelect: (selectedOption: string) => void; // Callback for option selection
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  label,
  placeholder,
  collectionName,
  value,
  onOptionSelect,
}) => {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]); // Store fetched options
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [filteredOptions, setFilteredOptions] = useState<
    { id: string; name: string }[]
  >([]); // Filtered options based on input

  useEffect(() => {
    const fetchOptions = async () => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const fetchedOptions = querySnapshot.docs.map((doc) => ({
        id: doc.data().customerID,
        name: doc.data().customerName, // Assuming the document has a 'name' field
      }));
      setOptions(fetchedOptions);
      setFilteredOptions(fetchedOptions); // Initialize filtered options
    };

    fetchOptions();
  }, [collectionName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value ? e.target.value.toLowerCase() : ""; // Check if value is defined
    setFilteredOptions(
      options.filter((option) => option.name.toLowerCase().includes(query))
    );
    setDropdownOpen(true); // Open dropdown when typing
  };

  const handleOptionSelect = (selectedOption: { id: string; name: string }) => {
    onOptionSelect(`${selectedOption.id} - ${selectedOption.name}`); // Send selected option back to parent
    setDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setDropdownOpen(true)} // Open dropdown on focus
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {`${option.id} - ${option.name}`} {/* Display both ID and Name */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
