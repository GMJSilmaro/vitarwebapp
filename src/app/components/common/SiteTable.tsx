import React, { useState } from "react";
import { Site } from "@/app/types/CustomerSiteInfo";
import SiteSelectionModal from "./SiteSelectionModal";

interface SiteTableProps {
  onSelectSite: (selectedSite: Site[]) => void;
  selectedSite: Site[]; // Accept selectedSite as prop
}

const SiteTable: React.FC<SiteTableProps> = ({
  onSelectSite,
  selectedSite,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSiteSelect = (sites: Site[]) => {
    const updatedSelected = [
      ...selectedSite,
      ...sites.filter(
        (newItem) =>
          !selectedSite.some((item) => item.siteID === newItem.siteID)
      ),
    ];
    onSelectSite(updatedSelected); // Pass updated selected sites back to the parent
    handleCloseModal(); // Close the modal after selection
  };

  const handleCheckboxChange = (siteID: string) => {
    onSelectSite(selectedSite.filter((item) => item.siteID !== siteID)); // Update selected sites in parent
  };

  return (
    <div className="overflow-x-auto mt-4">
      <button
        type="button"
        onClick={handleOpenModal}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Select Sites
      </button>
      {selectedSite.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300">Remove</th>
              <th className="p-2 border border-gray-300">Site ID</th>
              <th className="p-2 border border-gray-300">Site Name</th>
              <th className="p-2 border border-gray-300">Street 1</th>
              <th className="p-2 border border-gray-300">Street 2</th>
              <th className="p-2 border border-gray-300">Street 3</th>
            </tr>
          </thead>
          <tbody>
            {selectedSite.map((site) => (
              <tr key={site.siteID}>
                <td className="p-2 border border-gray-300">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleCheckboxChange(site.siteID)}
                  />
                </td>
                <td className="p-2 border border-gray-300">{site.siteID}</td>
                <td className="p-2 border border-gray-300">{site.siteName}</td>
                <td className="p-2 border border-gray-300">{site.street1}</td>
                <td className="p-2 border border-gray-300">{site.street2}</td>
                <td className="p-2 border border-gray-300">{site.street3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sites selected. Click the button to select sites.</p>
      )}

      {isModalOpen && (
        <SiteSelectionModal
          onClose={handleCloseModal}
          onSelectSite={handleSiteSelect}
          initiallySelectedSite={selectedSite} // Pass selected items here
        />
      )}
    </div>
  );
};

export default SiteTable;
