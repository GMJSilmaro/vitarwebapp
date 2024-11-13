import React, { useEffect, useState } from "react";
import { Equipment } from "@/app/types/Equipment";
import {
  //arrayUnion,
  collection,
  // doc,
  getDocs,
  //   updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Button from "@/app/components/common/Button";

interface AddCustomerEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedEquipment: Equipment[]) => void;
}

const AddCustomerEquipmentModal: React.FC<AddCustomerEquipmentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(
    new Set()
  );

  // Fetch all equipment from Firestore
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const equipmentCollection = collection(db, "equipment");
        const equipmentSnapshot = await getDocs(equipmentCollection);
        const equipmentData = equipmentSnapshot.docs.map((doc) => {
          const data = doc.data() as Equipment;
          return {
            id: doc.id, // Document ID
            equipmentID: data.equipmentID, // Explicitly define properties to avoid conflicts
            equipmentName: data.equipmentName,
            typeOfScope: data.typeOfScope,
            description: data.description,
            tagID: data.tagID,
            make: data.make,
            model: data.model,
            serialNumber: data.serialNumber,
            rangeType: data.rangeType,
            rangeMinTemp: data.rangeMinTemp,
            rangeMaxTemp: data.rangeMaxTemp,
            rangeMinPercent: data.rangeMinPercent,
            rangeMaxPercent: data.rangeMaxPercent,
            certificateNo: data.certificateNo,
            traceability: data.traceability,
          };
        });
        setEquipmentList(equipmentData);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    if (isOpen) {
      fetchEquipment();
    }
  }, [isOpen]);

  // Filter equipment list based on search term
  const filteredEquipment = equipmentList.filter((equipment) =>
    equipment.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selection toggle for equipment
  const handleSelectEquipment = (equipmentID: string) => {
    setSelectedEquipment((prevSelected) => {
      const updatedSelection = new Set(prevSelected);
      if (updatedSelection.has(equipmentID)) {
        updatedSelection.delete(equipmentID);
      } else {
        updatedSelection.add(equipmentID);
      }

      // Debugging: log the current state of selectedEquipment
      console.log(
        "Current selected equipment IDs:",
        Array.from(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleAddEquipment = () => {
    // Find selected equipment details based on selectedEquipment IDs
    const selectedEquipmentDetails = equipmentList.filter((equipment) =>
      selectedEquipment.has(equipment.equipmentID)
    );

    // Debugging: log the selected equipment details
    console.log("Selected equipment details:", selectedEquipmentDetails);

    onAdd(selectedEquipmentDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4 text-black">Add Equipment</h2>
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
        />
        <div className="overflow-y-auto max-h-64 mb-4">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">Equipment ID</th>
                <th className="px-4 py-2">Equipment Name</th>
                <th className="px-4 py-2">Type of Scope</th>
                <th className="px-4 py-2">Tag ID</th>
                <th className="px-4 py-2">Traceability</th>
                <th className="px-4 py-2">Certificate No.</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((equipment) => (
                <tr key={equipment.id}>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.has(equipment.id)}
                      onChange={() => handleSelectEquipment(equipment.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{equipment.equipmentID}</td>
                  <td className="px-4 py-2">{equipment.equipmentName}</td>
                  <td className="px-4 py-2">{equipment.typeOfScope}</td>
                  <td className="px-4 py-2">{equipment.tagID}</td>
                  <td className="px-4 py-2">{equipment.traceability}</td>
                  <td className="px-4 py-2">{equipment.certificateNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="flex justify-end gap-4
        "
        >
          <Button type="button" label="Cancel" onClick={onClose} />
          <Button
            type="button"
            label="Add Selected"
            onClick={handleAddEquipment}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCustomerEquipmentModal;
