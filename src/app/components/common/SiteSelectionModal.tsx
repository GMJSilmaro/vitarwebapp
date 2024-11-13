import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase/config"; // Adjust the path to your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { Site } from "@/app/types/CustomerSiteInfo";

import SearchDropdown from "./EquipmentSearchDropdown";

interface SiteSelectionModalProps {
  onClose: () => void;
  onSelectSite: (selectedSite: Site[]) => void;
  initiallySelectedSite?: Site[]; // Prop for initially selected Site
}

const SiteSelectionModal: React.FC<SiteSelectionModalProps> = ({
  onClose,
  onSelectSite,
  initiallySelectedSite = [], // Default to an empty array
}) => {
  const [SiteList, setSiteList] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Set<string>>(
    new Set(initiallySelectedSite.map((e) => e.id))
  ); // Initialize selectedSite with initiallySelectedSite
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Site data from Firebase
  useEffect(() => {
    const fetchSite = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "site"));
        const SiteData: Site[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          SiteData.push({
            id: doc.id,
            siteID: data.siteID || "",
            siteName: data.siteName || "",
            customerID: "",
            customerName: "",
            street1: data.street1 || "",
            street2: data.street2 || "",
            street3: data.street3 || "",
            city: data.city || "",
            postCode: data.postCode || "",
            country: data.country || "",
            state: data.state || "",
          });
        });
        setSiteList(SiteData);
      } catch (error) {
        console.error("Error fetching Site:", error);
      }
    };

    fetchSite();
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (id: string) => {
    const updatedSelection = new Set(selectedSite);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedSite(updatedSelection);
  };

  // Pass selected Site back to the parent
  const handleConfirmSelection = () => {
    const selectedArray = Array.from(selectedSite)
      .map((selectedId) => SiteList.find((Site) => Site.siteID === selectedId))
      .filter(Boolean) as Site[];

    console.log("Selected Site in Modal:", selectedArray); // Log selected Site
    onSelectSite(selectedArray);
    onClose(); // Close the modal after selection
  };

  // Pagination logic
  const indexOfLastSite = currentPage * entriesPerPage;
  const indexOfFirstSite = indexOfLastSite - entriesPerPage;

  // Filter Site based on the search term
  const filteredSite = SiteList.filter((Site) =>
    Site.siteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSite = filteredSite.slice(indexOfFirstSite, indexOfLastSite);

  const totalPages = Math.ceil(filteredSite.length / entriesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on change
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full h-[500px]">
        <h2 className="text-lg font-semibold mb-2">Select Site</h2>

        <SearchDropdown
          placeholder="Search Site..."
          onSelect={(option) => setSearchTerm(option)}
          collectionName="equipment" // For Equipment
        />

        <div className="flex justify-between mb-4 mt-2">
          <div>
            <label htmlFor="entriesPerPage" className="mr-2">
              Entries per page:
            </label>
            <select
              id="entriesPerPage"
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
              className="border border-gray-300 p-1"
            >
              {[5, 10, 15, 20].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            {/* Pagination Controls */}
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="ml-2 bg-gray-300 p-1 rounded"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2 bg-gray-300 p-1 rounded"
            >
              Next
            </button>
          </div>
        </div>

        {/* Fixed size table with overflow */}
        <div className="overflow-auto max-h-60">
          {" "}
          {/* Adjust max-h to your needs */}
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300">Select</th>
                <th className="p-2 border border-gray-300">Site ID</th>
                <th className="p-2 border border-gray-300">Site Name</th>
                <th className="p-2 border border-gray-300">Street 1</th>
                <th className="p-2 border border-gray-300">Street 2</th>
                <th className="p-2 border border-gray-300">Street 3</th>
                <th className="p-2 border border-gray-300">State</th>
                <th className="p-2 border border-gray-300">Post Code</th>
                <th className="p-2 border border-gray-300">Country</th>
              </tr>
            </thead>
            <tbody>
              {currentSite.map((Site) => (
                <tr key={Site.siteID}>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedSite.has(Site.siteID)}
                      onChange={() => handleCheckboxChange(Site.siteID)}
                    />
                  </td>
                  <td className="p-2 border border-gray-300">{Site.siteID}</td>
                  <td className="p-2 border border-gray-300">
                    {Site.siteName}
                  </td>
                  <td className="p-2 border border-gray-300">{Site.street1}</td>
                  <td className="p-2 border border-gray-300">{Site.street2}</td>
                  <td className="p-2 border border-gray-300">{Site.street3}</td>
                  <td className="p-2 border border-gray-300">{Site.state}</td>
                  <td className="p-2 border border-gray-300">
                    {Site.postCode}
                  </td>
                  <td className="p-2 border border-gray-300">{Site.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <span>
            Showing {indexOfFirstSite + 1} to{" "}
            {Math.min(indexOfLastSite, filteredSite.length)} of{" "}
            {filteredSite.length} entries
          </span>
          <div>
            <button
              onClick={handleConfirmSelection}
              className="mt-2 p-2 bg-green-500 text-white rounded"
            >
              Confirm Selection
            </button>
            <button
              onClick={onClose}
              className="mt-2 ml-2 p-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSelectionModal;
