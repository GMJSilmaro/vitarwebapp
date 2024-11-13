import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";

interface CheckboxTableProps {
  onSelectItems: (selectedItems: string[]) => void; // Pass selected items back to parent
}

interface EquipmentItem {
  id: string;
  name: string;
}

const CheckboxTable: React.FC<CheckboxTableProps> = ({ onSelectItems }) => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch equipment data from Firebase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "equipment")); // Replace with your Firestore collection name
        const fetchedEquipment: EquipmentItem[] = [];
        querySnapshot.forEach((doc) => {
          fetchedEquipment.push({ id: doc.id, name: doc.data().name });
        });
        setEquipmentList(fetchedEquipment);
      } catch (error) {
        console.error("Error fetching equipment from Firebase:", error);
      }
    };

    fetchEquipment();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (itemId: string) => {
    const updatedSelection = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId) // Uncheck: remove from selection
      : [...selectedItems, itemId]; // Check: add to selection

    setSelectedItems(updatedSelection);
    onSelectItems(updatedSelection); // Pass selected items to parent
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">Select</th>
            <th className="py-2 px-4 text-left">Equipment Name</th>
          </tr>
        </thead>
        <tbody>
          {equipmentList.length > 0 ? (
            equipmentList.map((equipment) => (
              <tr key={equipment.id}>
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(equipment.id)}
                    onChange={() => handleCheckboxChange(equipment.id)}
                  />
                </td>
                <td className="py-2 px-4">{equipment.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="py-4 px-4 text-center">
                No equipment available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckboxTable;
