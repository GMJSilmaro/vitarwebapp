import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config"; // Adjust the import according to your project structure
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import Button from "@/app/components/common/Button"; // Adjust this import too
import Swal from "sweetalert2";

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerID: string; // Pass customerID to link the site to the correct customer
}

const AddCustomerSiteModal: React.FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  customerID,
}) => {
  const [siteID, setSiteID] = useState("S-001"); // Default Site ID
  const [siteName, setSiteName] = useState("");
  const [siteStreet1, setSiteStreet1] = useState("");
  const [siteStreet2, setSiteStreet2] = useState("");
  const [siteStreet3, setSiteStreet3] = useState("");
  const [siteCity, setSiteCity] = useState("");
  const [siteState, setSiteState] = useState("");
  const [sitePostCode, setSitePostCode] = useState("");
  const [siteCountry, setSiteCountry] = useState("");

  // Fetch the latest siteID from Firestore
  useEffect(() => {
    const fetchLastSiteID = async () => {
      const siteCollection = collection(db, "site");
      const siteQuery = query(
        siteCollection,
        orderBy("siteID", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(siteQuery);

      if (!querySnapshot.empty) {
        const lastSiteDoc = querySnapshot.docs[0];
        const lastSiteID = lastSiteDoc.data().siteID;

        // Extract the number part of the siteID and increment it
        const idNumber = parseInt(lastSiteID.split("-")[1], 10) + 1;
        const newSiteID = `S-${idNumber.toString().padStart(3, "0")}`;
        setSiteID(newSiteID);
      } else {
        // If no previous siteID is found, start from SI-001
        setSiteID("S-001");
      }
    };

    if (isOpen) {
      fetchLastSiteID();
    }
  }, [isOpen]);

  const handleAddSite = async () => {
    try {
      // Step 1: Generate the new siteID for the "site" collection (S-001, S-002, etc.)
      const siteCollection = collection(db, "site");
      const siteQuery = query(
        siteCollection,
        orderBy("siteID", "desc"),
        limit(1)
      );
      const siteQuerySnapshot = await getDocs(siteQuery);

      let newSiteID = "S-001"; // Default ID if no documents are found
      if (!siteQuerySnapshot.empty) {
        const lastSiteDoc = siteQuerySnapshot.docs[0];
        const lastSiteID = lastSiteDoc.id;

        // Extract the number part of the last siteID and increment it
        const siteIdNumber = parseInt(lastSiteID.split("-")[1], 10) + 1;
        newSiteID = `S-${siteIdNumber.toString().padStart(3, "0")}`;
      }

      // Step 2: Generate the running number for the new siteInfo document (SI-001, SI-002, etc.)
      const siteInfoCollection = collection(
        db,
        `customerInfo/${customerID}/siteInfo`
      );
      const siteInfoQuery = query(
        siteInfoCollection,
        orderBy("siteID", "desc"),
        limit(1)
      );
      const siteInfoQuerySnapshot = await getDocs(siteInfoQuery);

      let newSiteInfoID = "SI-001"; // Default ID if no documents are found
      if (!siteInfoQuerySnapshot.empty) {
        const lastSiteInfoDoc = siteInfoQuerySnapshot.docs[0];
        const lastSiteInfoID = lastSiteInfoDoc.id;

        // Extract the number part of the last siteInfo ID and increment it
        const idNumber = parseInt(lastSiteInfoID.split("-")[1], 10) + 1;
        newSiteInfoID = `SI-${idNumber.toString().padStart(3, "0")}`;
      }

      // Step 3: Create the new site data object for the "site" collection
      const newSite = {
        siteID: newSiteID, // This will be the ID in the "site" collection
        siteName,
        street1: siteStreet1,
        street2: siteStreet2,
        street3: siteStreet3,
        city: siteCity,
        state: siteState,
        postCode: sitePostCode,
        country: siteCountry,
      };

      // Step 4: Add the new site to the "site" collection with siteID as the document ID
      const siteDocRef = doc(siteCollection, newSiteID);
      await setDoc(siteDocRef, newSite);

      // Step 5: Create the new site data object for siteInfo
      const newSiteInfo = {
        siteID: newSiteID, // This will be the ID in the "siteInfo" collection
        siteName,
        street1: siteStreet1,
        street2: siteStreet2,
        street3: siteStreet3,
        city: siteCity,
        state: siteState,
        postCode: sitePostCode,
        country: siteCountry,
        createdAt: new Date(), // Keep createdAt for siteInfo only
      };

      // Step 6: Add to the "siteInfo" subcollection under the respective customer document
      const customerSiteInfoRef = doc(
        db,
        `customerInfo/${customerID}/siteInfo/${newSiteInfoID}`
      );
      await setDoc(customerSiteInfoRef, newSiteInfo); // Add site to the siteInfo subcollection

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Site and Site Info added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Refresh the current window
      });

      // Clear fields and close the modal
      setSiteID(""); // Reset to default ID
      setSiteName("");
      setSiteStreet1("");
      setSiteStreet2("");
      setSiteStreet3("");
      setSiteCity("");
      setSiteState("");
      setSitePostCode("");
      setSiteCountry("");
      onClose();
    } catch (error) {
      console.error("Error adding site: ", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the site.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/3 max-w-4xl">
        <h2 className="text-xl text-black mb-4 items-center text-center">
          Add Site
        </h2>
        <div className="space-y-4 grid grid-cols-2 gap-4 text-black">
          <div className="flex flex-col mt-4">
            <label className="block mb-2">Site ID</label>
            <input
              type="text"
              value={siteID}
              onChange={(e) => setSiteID(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              disabled // Disable since we are generating the ID
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Street 1</label>
            <input
              type="text"
              value={siteStreet1}
              onChange={(e) => setSiteStreet1(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Street 2</label>
            <input
              type="text"
              value={siteStreet2}
              onChange={(e) => setSiteStreet2(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Street 3</label>
            <input
              type="text"
              value={siteStreet3}
              onChange={(e) => setSiteStreet3(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">City</label>
            <input
              type="text"
              value={siteCity}
              onChange={(e) => setSiteCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">State</label>
            <input
              type="text"
              value={siteState}
              onChange={(e) => setSiteState(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Post Code</label>
            <input
              type="text"
              value={sitePostCode}
              onChange={(e) => setSitePostCode(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">Country</label>
            <input
              type="text"
              value={siteCountry}
              onChange={(e) => setSiteCountry(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <Button type="button" label="Cancel" onClick={onClose} />
          <Button type="button" label="Add Site" onClick={handleAddSite} />
        </div>
      </div>
    </div>
  );
};

export default AddCustomerSiteModal;
