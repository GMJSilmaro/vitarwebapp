import React, { useState, useEffect } from "react";
import InputField from "@/app/components/common/InputField";
import Button from "@/app/components/common/Button";
import { Equipment } from "@/app/types/Equipment"; // Import Equipment type
import DisabledField from "../common/DisabledField";
import { db } from "@/app/firebase/config"; // Firestore configuration
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"; // Firestore methods
import Swal from "sweetalert2"; // Optional for success/error alerts

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEquipment: (equipment: Equipment) => void; // Use Equipment type here
  scopeLabel: string; // New prop to set the scope label
}

const AddSpecificEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onAddEquipment,
  scopeLabel,
}) => {
  // Tabs state
  const [activeTab, setActiveTab] = useState("general");

  // Form state initialization
  const [equipmentID, setEquipmentID] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [description, setDescription] = useState("");
  const [tagID, setTagID] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [typeOfScope, setTypeOfScope] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [rangeType, setRangeType] = useState("");
  const [rangeMinTemp, setRangeMinTemp] = useState("");
  const [rangeMaxTemp, setRangeMaxTemp] = useState("");
  const [rangeMinPercent, setRangeMinPercent] = useState("");
  const [rangeMaxPercent, setRangeMaxPercent] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
  const [traceability, setTraceability] = useState("");

  // Fetch the latest equipment ID and increment it
  useEffect(() => {
    const fetchLatestEquipmentID = async () => {
      const equipmentCollectionRef = collection(db, "equipment");
      const q = query(
        equipmentCollectionRef,
        orderBy("equipmentID", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latestEquipment = querySnapshot.docs[0].data();
        const latestID = parseInt(
          latestEquipment.equipmentID.replace("E-", ""),
          10
        );
        const nextID = `E-${String(latestID + 1).padStart(3, "0")}`; // Increment and format
        setEquipmentID(nextID);
      } else {
        setEquipmentID("E-001"); // Default to E-001 if no entries exist
      }
    };

    if (isOpen) {
      fetchLatestEquipmentID();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare new equipment object
    const newEquipment: Equipment = {
      equipmentID,
      equipmentName,
      typeOfScope,
      description,
      tagID,
      make,
      model,
      serialNumber,
      certificateNo,
      traceability,
      rangeMinTemp,
      rangeMaxTemp,
      rangeMinPercent,
      rangeMaxPercent,
      rangeType,
      id: "",
      customerID: "",
      customerName: "",
      siteID: "",
      siteName: "",
    };

    try {
      const equipmentDocRef = doc(db, "equipment", equipmentID);
      await setDoc(equipmentDocRef, newEquipment);

      await Swal.fire({
        title: "Success!",
        text: "Specific equipment added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      onAddEquipment(newEquipment);
      onClose();
    } catch (error) {
      console.error("Error adding specific equipment to Firestore:", error);

      await Swal.fire({
        title: "Error!",
        text: "There was an error adding the equipment. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg xl:max-w-5xl h-[650px] relative transform transition-transform duration-300 ease-in-out scale-100 hover:scale-105">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 focus:outline-none transition duration-200"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add {scopeLabel} Equipment
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "general" ? "text-red-500" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General Information
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "details" ? "text-red-500" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Range & Certification
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === "general" && (
            <div className="grid grid-cols-2 gap-2">
              <DisabledField
                id="equipment_id"
                label="Equipment ID"
                placeholder="Enter Equipment ID"
                value={equipmentID}
              />
              <InputField
                id="equipment_name"
                label="Equipment Name"
                placeholder="Enter Equipment Name"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
              />
              <InputField
                id="scope"
                label="Type of Scope"
                placeholder="Select..."
                value={scopeLabel}
                onChange={(e) => setTypeOfScope(e.target.value)}
              />
              <InputField
                id="description"
                label="Description"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <InputField
                id="tag_id"
                label="Tag ID"
                placeholder="Enter Tag ID"
                value={tagID}
                onChange={(e) => setTagID(e.target.value)}
              />
              <InputField
                id="make"
                label="Make"
                placeholder="Enter Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
              <InputField
                id="model"
                label="Model"
                placeholder="Enter Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <InputField
                id="serial_number"
                label="Serial Number"
                placeholder="Enter Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          )}
          {activeTab === "details" && (
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="range_type"
                label="Range Type"
                placeholder="Range Type"
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value)}
              />
              <InputField
                id="range_mintemp"
                label="Range Temp(Min)"
                placeholder="Min Temp Range"
                value={rangeMinTemp}
                onChange={(e) => setRangeMinTemp(e.target.value)}
              />
              <InputField
                id="range_maxtemp"
                label="Range Temp(Max)"
                placeholder="Max Temp Range"
                value={rangeMaxTemp}
                onChange={(e) => setRangeMaxTemp(e.target.value)}
              />
              <InputField
                id="range_min"
                label="Range Percent(Min)"
                placeholder="Min Percent Range"
                value={rangeMinPercent}
                onChange={(e) => setRangeMinPercent(e.target.value)}
              />
              <InputField
                id="range_max"
                label="Range Percent(Max)"
                placeholder="Max Percent Range"
                value={rangeMaxPercent}
                onChange={(e) => setRangeMaxPercent(e.target.value)}
              />
              <InputField
                id="certificate_no"
                label="Certificate No."
                placeholder="Enter Certificate No."
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
              />{" "}
              <InputField
                id="traceability"
                label="Traceability"
                placeholder="Enter Traceability"
                value={traceability}
                onChange={(e) => setTraceability(e.target.value)}
              />{" "}
            </div>
          )}{" "}
          <div className="flex justify-end mt-6">
            <Button label="Submit" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpecificEquipmentModal;
