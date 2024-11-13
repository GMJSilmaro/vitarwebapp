import React, { useState, useEffect, useRef } from "react";
import { db } from "@/app/firebase/config"; // Adjust the path to where your Firebase config is
import { collection, getDocs } from "firebase/firestore";

interface SearchDropdownProps {
  placeholder?: string;
  onSelect: (selectedOption: string) => void;
  collectionName: "equipment" | "site"; // Specify the collection name
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder = "Search...",
  onSelect,
  collectionName, // Receive the collection name
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown

  // Fetch data from Firebase on component mount based on collectionName
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const optionsList: string[] = [];
        querySnapshot.forEach((doc) => {
          // Adjust the field being fetched based on the collection
          if (collectionName === "equipment") {
            optionsList.push(doc.data().equipmentName); // Assuming 'equipmentName' field
          } else if (collectionName === "site") {
            optionsList.push(doc.data().siteName); // Assuming 'siteName' field
          }
        });
        setOptions(optionsList);
      } catch (error) {
        console.error("Error fetching options from Firebase:", error);
      }
    };

    fetchOptions();
  }, [collectionName]); // Depend on collectionName to refetch if it changes

  // Filter options based on search term
  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // Handle selecting an option
  const handleSelect = (option: string) => {
    setSearchTerm(option);
    setShowDropdown(false);
    onSelect(option); // Pass the selected option to the parent
  };

  // Handle click outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute w-full mt-1 max-h-60 bg-white border rounded-md shadow-lg overflow-y-auto z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
