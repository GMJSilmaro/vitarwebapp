import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase/config"; // Adjust the path to your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { Equipment } from "@/app/types/Equipment";
import SearchDropdown from "./EquipmentSearchDropdown"; // Adjust the import path accordingly

interface EquipmentSelectionModalProps {
  onClose: () => void;
  onSelectEquipment: (selectedEquipment: Equipment[]) => void;
  initiallySelectedEquipment?: Equipment[]; // Prop for initially selected equipment
}

const EquipmentSelectionModal: React.FC<EquipmentSelectionModalProps> = ({
  onClose,
  onSelectEquipment,
  initiallySelectedEquipment = [], // Default to an empty array
}) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(
    new Set(initiallySelectedEquipment.map((e) => e.id))
  ); // Initialize selectedEquipment with initiallySelectedEquipment
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch equipment data from Firebase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "equipment"));
        const equipmentData: Equipment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          equipmentData.push({
            id: doc.id,
            certificateNo: data.certificateNo || "-",
            description: data.description || "",
            equipmentID: data.equipmentID || "",
            equipmentName: data.equipmentName || "",
            make: data.make || "",
            model: data.model || "",
            rangeMaxPercent: data.rangeMaxPercent || "",
            rangeMaxTemp: data.rangeMaxTemp || "",
            rangeMinPercent: data.rangeMinPercent || "",
            rangeMinTemp: data.rangeMinTemp || "",
            rangeType: data.rangeType || "-",
            serialNumber: data.serialNumber || 0,
            tagID: data.tagID || "",
            traceability: data.traceability || "-",
            typeOfScope: data.typeOfScope || "",
            customerID: "",
            customerName: "",
            siteID: "",
            siteName: "",
            rangeMin: "",
            rangeMax: "",
          });
        });
        setEquipmentList(equipmentData);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    fetchEquipment();
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (id: string) => {
    const updatedSelection = new Set(selectedEquipment);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedEquipment(updatedSelection);
  };

  // Pass selected equipment back to the parent
  const handleConfirmSelection = () => {
    const selectedArray = Array.from(selectedEquipment)
      .map((selectedId) =>
        equipmentList.find((equipment) => equipment.id === selectedId)
      )
      .filter(Boolean) as Equipment[];

    console.log("Selected Equipment in Modal:", selectedArray); // Log selected equipment
    onSelectEquipment(selectedArray);
    onClose(); // Close the modal after selection
  };

  // Pagination logic
  const indexOfLastEquipment = currentPage * entriesPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - entriesPerPage;

  // Filter equipment based on the search term
  const filteredEquipment = equipmentList.filter((equipment) =>
    equipment.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentEquipment = filteredEquipment.slice(
    indexOfFirstEquipment,
    indexOfLastEquipment
  );

  const totalPages = Math.ceil(filteredEquipment.length / entriesPerPage);

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
      <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full">
        <h2 className="text-lg font-semibold mb-2">Select Equipment</h2>

        <SearchDropdown
          placeholder="Search Equipment..."
          onSelect={(option) => setSearchTerm(option)}
          collectionName="equipment"
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

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300">Select</th>
              <th className="p-2 border border-gray-300">Equipment ID</th>
              <th className="p-2 border border-gray-300">Equipment Name</th>
              <th className="p-2 border border-gray-300">Equipment Make</th>
              <th className="p-2 border border-gray-300">
                Equipment Scope Type
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEquipment.map((equipment) => (
              <tr key={equipment.id}>
                <td className="p-2 border border-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedEquipment.has(equipment.id)}
                    onChange={() => handleCheckboxChange(equipment.id)}
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  {equipment.equipmentID}
                </td>
                <td className="p-2 border border-gray-300">
                  {equipment.equipmentName}
                </td>
                <td className="p-2 border border-gray-300">{equipment.make}</td>
                <td className="p-2 border border-gray-300">
                  {equipment.typeOfScope}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-4">
          <span>
            Showing {indexOfFirstEquipment + 1} to{" "}
            {Math.min(indexOfLastEquipment, filteredEquipment.length)} of{" "}
            {filteredEquipment.length} entries
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

export default EquipmentSelectionModal;
