"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import ExcelItem from "@/app/types/ExcelItem";
import { db } from "@/app/firebase/config"; // Ensure this is your correct Firebase config
import { collection, setDoc, doc } from "firebase/firestore";

const ExcelUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    // Read the uploaded Excel file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: ExcelItem[] = XLSX.utils.sheet_to_json(worksheet);

    console.log("Parsed Excel Data:", jsonData); // Log to check what data is coming in

    // Prepare data for Firestore
    const equipmentData = jsonData.map((item, index) => {
      // Split the Range field into temperature range and percentage range
      const ranges = (item.Range || "").split("/").map((range) => range.trim());

      let rangeMinTemp = "";
      let rangeMaxTemp = "";
      let rangeMinPercent = "";
      let rangeMaxPercent = "";

      if (ranges.length > 0) {
        // Handle the temperature range
        const tempRange = ranges[0].split("~").map((temp) => temp.trim());
        rangeMinTemp = tempRange[0] || ""; // Set min temperature
        rangeMaxTemp = tempRange[1] || ""; // Set max temperature
      }

      if (ranges.length > 1) {
        // Handle the percentage range
        const percentRange = ranges[1]
          .split("~")
          .map((percent) => percent.trim());
        rangeMinPercent = percentRange[0] || ""; // Set min percentage
        rangeMaxPercent = percentRange[1] || ""; // Set max percentage
      }

      return {
        equipmentID: `E-${String(index + 1).padStart(3, "0")}`,
        equipmentName: item.Description || "", // Map Description to Equipment Name
        typeOfScope: item.Scope || "", // Capture Scope directly
        description: item.Description || "",
        tagID: item["Tag Id"] || "",
        make: item.Make || item["Make"] || "", // Check different possible variations for the "Make" field
        model: item.Model || "",
        serialNumber: item["Serial Number"] || "",
        rangeType: item.Type || "",
        rangeMinTemp: rangeMinTemp,
        rangeMaxTemp: rangeMaxTemp,
        rangeMinPercent: rangeMinPercent,
        rangeMaxPercent: rangeMaxPercent,
        certificateNo: item["Certificate No."] || "",
        traceability: item.Traceability || "",
      };
    });

    // Store each equipment entry in Firestore
    const equipmentCollectionRef = collection(db, "equipment");
    for (const equipment of equipmentData) {
      try {
        // Use setDoc to set the document ID as equipmentID
        const equipmentDocRef = doc(
          equipmentCollectionRef,
          equipment.equipmentID
        );
        await setDoc(equipmentDocRef, equipment);
        console.log(Object.keys(jsonData[0])); // This will log all the headers as interpreted by the library
        console.log("Equipment added:", equipment);
      } catch (error) {
        console.error("Error adding equipment:", error);
      }
    }

    // Clear the file state
    setFile(null);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file}>
        Upload
      </button>
    </div>
  );
};

export default ExcelUpload;
