import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

interface Worker {
  workerId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

interface SearchDropdownWithTaggingProps {
  label: string;
  placeholder: string;
  collectionName: string;
  onSelectionChange: (selectedItems: Worker[]) => void;
}

const SearchDropdownWithTagging: React.FC<SearchDropdownWithTaggingProps> = ({
  label,
  placeholder,
  collectionName,
  onSelectionChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Worker[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Worker[]>([]);
  const [selectedItems, setSelectedItems] = useState<Worker[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Fetch all workers from Firestore on component mount
  useEffect(() => {
    const fetchWorkers = async () => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const fetchedOptions: Worker[] = querySnapshot.docs.map((doc) => ({
        workerId: doc.data().workerId,
        firstName: doc.data().firstName,
        middleName: doc.data().middleName || "",
        lastName: doc.data().lastName,
      }));
      setOptions(fetchedOptions);
      setFilteredOptions(fetchedOptions); // Initially show all options
    };

    fetchWorkers();
  }, [collectionName]);

  // Filter options when search term is typed
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      // Filter the options based on the search term
      const filtered = options.filter((worker) =>
        `${worker.workerId} ${worker.firstName} ${worker.middleName} ${worker.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      // Show all options if the search term is cleared
      setFilteredOptions(options);
    }
  };

  // Handle option selection
  const handleSelectOption = (worker: Worker) => {
    if (!selectedItems.find((item) => item.workerId === worker.workerId)) {
      const updatedSelection = [...selectedItems, worker];
      setSelectedItems(updatedSelection);
      onSelectionChange(updatedSelection); // Pass selected items to parent
    }
    setSearchTerm(""); // Clear search input after selection
    setIsDropdownVisible(false); // Hide dropdown after selection
  };

  // Handle tag removal
  const handleRemoveTag = (worker: Worker) => {
    const updatedSelection = selectedItems.filter(
      (item) => item.workerId !== worker.workerId
    );
    setSelectedItems(updatedSelection);
    onSelectionChange(updatedSelection); // Update parent with the new selection
  };

  // Handle focus and blur for dropdown visibility
  const handleInputFocus = () => {
    setIsDropdownVisible(true); // Show dropdown when input is focused
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow click event to register on dropdown items
    setTimeout(() => setIsDropdownVisible(false), 150);
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-bold text-gray-900">
        {label}
      </label>

      {/* Input with tags inside */}
      <div className="flex items-center flex-wrap bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
        {/* Selected tags */}
        {selectedItems.map((worker) => (
          <span
            key={worker.workerId}
            className="bg-red-500 text-white rounded-lg px-3 py-1 mr-2 mb-1 flex items-center"
          >
            {`${worker.workerId} - ${worker.firstName} ${worker.middleName} ${worker.lastName}`}
            <button
              type="button"
              className="ml-2 text-sm text-white hover:text-red-600"
              onClick={() => handleRemoveTag(worker)}
            >
              ✕
            </button>
          </span>
        ))}

        {/* Search Input */}
        <input
          type="text"
          className="flex-grow bg-transparent outline-none "
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus} // Show dropdown when focused
          onBlur={handleInputBlur} // Hide dropdown when blurred
        />
      </div>

      {/* Options Dropdown (only show when dropdown is visible) */}
      {isDropdownVisible && filteredOptions.length > 0 && (
        <ul className="bg-white border absolute border-gray-300 mt-2 rounded-lg max-h-40 overflow-y-auto">
          {filteredOptions.map((worker, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectOption(worker)}
            >
              {`${worker.workerId} - ${worker.firstName} ${worker.middleName} ${worker.lastName}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdownWithTagging;
