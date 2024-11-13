"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import SiteExcelItem from "@/app/types/SiteExcelItem";
import { db } from "@/app/firebase/config"; // Ensure this is your correct Firebase config
import { collection, setDoc, doc } from "firebase/firestore";

const SiteUpload: React.FC = () => {
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
    const jsonData: SiteExcelItem[] = XLSX.utils.sheet_to_json(worksheet);

    console.log("Parsed Excel Data:", jsonData); // Log to check what data is coming in

    // Prepare data for Firestore
    const siteData = jsonData.map((item, index) => {
      // Split the Range field into temperature range and percentage range

      return {
        siteID: `S-${String(index + 1).padStart(3, "0")}`,
        siteName: item["Site Name"] || "", // Map Description to Equipment Name\
        siteStreet1: item["Street1"] || "",
        siteStreet2: item["Street2"] || "",
        siteStreet3: item["Street3"] || "",
        sitePostCode: item["Postcode"] || "",
        siteCity: item["City"] || "",
        siteState: item["State"] || "",
        siteCountry: item["Country"] || "",
      };
    });

    // Store each equipment entry in Firestore
    const siteCollectionRef = collection(db, "site");
    for (const site of siteData) {
      try {
        const siteDocRef = doc(siteCollectionRef, site.siteID);
        await setDoc(siteDocRef, site);
        console.log(Object.keys(jsonData[0]));
        console.log("Equipment added:", site);
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

export default SiteUpload;
