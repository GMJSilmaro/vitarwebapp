import React, { useState } from "react";
import EquipmentSelectionModal from "./EquipmentSelectionModal"; // Import the modal component
import { CustomerEquipmentInfo } from "@/app/types/CustomerEquipmentInfo";

interface EquipmentTableProps {
  onSelectEquipment: (selectedEquipment: CustomerEquipmentInfo[]) => void;
  selectedEquipment: CustomerEquipmentInfo[]; // Accept selectedEquipment as a prop
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({
  onSelectEquipment,
  selectedEquipment, // Use the prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // This function will be passed to the modal to receive the selected equipment
  const handleEquipmentSelect = (equipment: CustomerEquipmentInfo[]) => {
    const updatedSelected = [
      ...selectedEquipment,
      ...equipment.filter(
        (newItem) =>
          !selectedEquipment.some(
            (item) => item.equipmentID === newItem.equipmentID
          )
      ),
    ];
    onSelectEquipment(updatedSelected); // Pass updated selected equipment back to the parent
    handleCloseModal(); // Close the modal after selection
  };

  const handleCheckboxChange = (equipmentID: string) => {
    onSelectEquipment(
      selectedEquipment.filter((item) => item.equipmentID !== equipmentID)
    ); // Update selected equipment in parent
  };

  return (
    <div className="overflow-x-auto mt-4">
      <button
        type="button"
        onClick={handleOpenModal}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Select Equipment
      </button>
      {/* Display the selected equipment in a table */}
      {selectedEquipment.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300">Remove</th>
              <th className="p-2 border border-gray-300">Equipment ID</th>
              <th className="p-2 border border-gray-300">Equipment Name</th>
              <th className="p-2 border border-gray-300">Equipment Make</th>
              <th className="p-2 border border-gray-300">
                Equipment Scope Type
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedEquipment.map((equipment) => (
              <tr key={equipment.equipmentID}>
                <td className="p-2 border border-gray-300">
                  <input
                    type="checkbox"
                    checked={true} // Checkbox is checked if you want to remove the item
                    onChange={() => handleCheckboxChange(equipment.equipmentID)}
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
      ) : (
        <p>No equipment selected. Click the button to select equipment.</p>
      )}

      {/* Equipment selection modal */}
      {isModalOpen && (
        <EquipmentSelectionModal
          onClose={handleCloseModal}
          onSelectEquipment={handleEquipmentSelect}
          initiallySelectedEquipment={selectedEquipment} // Pass selected items here
        />
      )}
    </div>
  );
};

export default EquipmentTable;
