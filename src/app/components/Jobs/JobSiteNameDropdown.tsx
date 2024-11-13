import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase/config";

interface SiteDropdownProps {
  label: string;
  placeholder: string;
  collectionName: string; // Collection name to fetch data from Firestore
  customerId: string; // Selected customer ID to filter sites
  value?: string;
  onSiteSelect: (selectedSite: string) => void; // Callback for site selection
}

const SiteDropdown: React.FC<SiteDropdownProps> = ({
  label,
  placeholder,
  collectionName,
  customerId,
  value = "",
  onSiteSelect,
}) => {
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]); // Store fetched sites
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [filteredSites, setFilteredSites] = useState<
    { id: string; name: string }[]
  >([]); // Filtered sites based on input

  useEffect(() => {
    const fetchSites = async () => {
      if (!customerId) return; // Do not fetch if no customer is selected
      const q = query(
        collection(db, collectionName),
        where("customerID", "==", customerId)
      ); // Query to get sites by customerId
      const querySnapshot = await getDocs(q);
      const fetchedSites = querySnapshot.docs.map((doc) => ({
        id: doc.data().siteID,
        name: doc.data().siteName, // Assuming the document has a 'name' field
      }));
      setSites(fetchedSites);
      setFilteredSites(fetchedSites); // Initialize filtered sites
    };

    fetchSites();
  }, [collectionName, customerId]); // Re-fetch sites when customerId changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value ? e.target.value.toLowerCase() : ""; // Check if value is defined
    setFilteredSites(
      sites.filter((site) => site.name.toLowerCase().includes(query))
    );
    setDropdownOpen(true); // Open dropdown when typing
  };

  const handleSiteSelect = (selectedSite: { id: string; name: string }) => {
    onSiteSelect(`${selectedSite.id} - ${selectedSite.name}`); // Send selected site back to parent
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
      {isDropdownOpen && filteredSites.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {filteredSites.map((site) => (
            <li
              key={site.id}
              onClick={() => handleSiteSelect(site)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {`${site.id} - ${site.name}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SiteDropdown;
