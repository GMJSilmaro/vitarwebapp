"use client";

import { useEffect, useState } from "react";
import InputField from "@/app/components/common/InputField";
import DisabledField from "@/app/components/common/DisabledField";
//import EquipmentTable from "@/app/components/common/EquipmentTable";
import { db } from "@/app/firebase/config";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Equipment } from "@/app/types/Equipment";
import Swal from "sweetalert2";
//import SiteTable from "@/app/components/common/SiteTable";
import { Site } from "@/app/types/Site";

const AddCustomerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("customerInfo");

  // State for Customer Info
  const [customerID, setCustomerID] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [TIN, setTIN] = useState("");
  const [BRN, setBRN] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [selectedEquipment] = useState<Equipment[]>([]); //setSelectedEquipment
  const [selectedSite] = useState<Site[]>([]); //setSelectedSite

  // const handleSelectEquipment = (newSelectedEquipment: Equipment[]) => {
  //   setSelectedEquipment(newSelectedEquipment);
  // };

  // const handleSelectSite = (newSelectedSites: Site[]) => {
  //   setSelectedSite(newSelectedSites);
  // };

  // Generate a new customerEquipmentID
  const generateEquipmentID = (index: number) => {
    return `CE-${String(index + 1).padStart(3, "0")}`;
  };

  // Generate a new siteID
  const generateSiteID = (index: number) => {
    return `SI-${String(index + 1).padStart(3, "0")}`; // e.g., SI-001, SI-002
  };

  // Fetch the next customer ID on component mount
  const fetchNextCustomerID = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "customerInfo"));
      const customerIDs: string[] = [];

      querySnapshot.forEach((doc) => {
        customerIDs.push(doc.id);
      });

      const maxID = customerIDs.reduce((max, id) => {
        const num = parseInt(id.split("-")[1]);
        return Math.max(max, num);
      }, 0);

      const newCustomerID = `C-${String(maxID + 1).padStart(3, "0")}`;
      setCustomerID(newCustomerID);
    } catch (error) {
      console.error("Error fetching customer IDs:", error);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirm Submission",
      text: "Are you sure you want to submit the customer information?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const customerRef = doc(db, "customerInfo", customerID);
      const customerSnapshot = await getDoc(customerRef);

      const customerData = {
        customerID,
        customerName,
        TIN,
        BRN,
        contact: [
          {
            contactFirstName,
            contactLastName,
            contactMiddleName: "", // Add this if needed
            contactPhone,
            contactEmail,
          },
        ],
      };

      if (!customerSnapshot.exists()) {
        // Create a new customer
        await setDoc(customerRef, customerData);
        console.log("New customer added:", customerID);
      } else {
        // Update existing customer
        await updateDoc(customerRef, customerData);
        console.log("Customer updated:", customerID);
      }

      // Save equipment information if any
      if (selectedEquipment.length > 0) {
        const equipmentPromises = selectedEquipment.map(
          async (equipment, index) => {
            const equipmentRef = doc(
              collection(customerRef, "equipmentInfo"),
              generateEquipmentID(index)
            );

            return setDoc(equipmentRef, {
              equipmentID: equipment.equipmentID,
              equipmentName: equipment.equipmentName,
              typeOfScope: equipment.typeOfScope,
              description: equipment.description,
              tagID: equipment.tagID,
              model: equipment.model,
              serialNumber: equipment.serialNumber,
              type: equipment.rangeType,
              range: `${equipment.rangeMinTemp} to ${equipment.rangeMaxTemp}`,
              rangePercent: `${equipment.rangeMinPercent} to ${equipment.rangeMaxPercent}`,
              traceability: equipment.traceability,
            });
          }
        );

        await Promise.all(equipmentPromises);
      }

      // Save site information if any
      if (selectedSite.length > 0) {
        const sitePromises = selectedSite.map(async (site, index) => {
          const siteRef = doc(
            collection(customerRef, "siteInfo"),
            generateSiteID(index)
          );

          return setDoc(siteRef, {
            siteID: siteRef.id,
            siteName: site.siteName,
            siteStreet1: site.street1,
            siteStreet2: site.street2,
            siteStreet3: site.street3,
            siteState: site.state,
            siteCity: site.city,
            sitePostCode: site.postCode,
            siteCountry: site.country,
          });
        });

        await Promise.all(sitePromises);
      }

      console.log("Customer information saved successfully!");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Customer information saved successfully.",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving data:", error);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error saving the data. Please try again.",
      });
    }
  };

  // Fetch next customer ID on mount
  useEffect(() => {
    fetchNextCustomerID();
  }, []);

  return (
    <div className="p-4 xl:p-12 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        Add Customer
      </h1>

      <div className="flex space-x-4 mb-8 border-b">
        {/* "siteInfo", "equipmentInfo" */}
        {["customerInfo"].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-4 py-2 border-b-2 ${
              activeTab === tab
                ? "border-red-600 text-red-600 font-semibold"
                : "border-transparent text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab === "customerInfo" && "Customer Info"}
            {/* {tab === "siteInfo" && "Site Info"}
            {tab === "equipmentInfo" && "Equipment Info"} */}
          </span>
        ))}
      </div>

      <form
        className="space-y-6 text-black bg-gray-200 p-8 m-4"
        onSubmit={handleSubmit}
      >
        {activeTab === "customerInfo" && (
          <>
            <h2 className="text-2xl font-bold mb-4 xl:mb-6">Customer Info</h2>

            <DisabledField
              id="customer_id"
              label="Customer ID"
              value={customerID}
            />

            <InputField
              id="customer_name"
              label="Customer Name"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 xl:gap-6 mb-6">
              <InputField
                id="tin"
                label="TIN No."
                placeholder="Enter TIN No."
                value={TIN}
                onChange={(e) => setTIN(e.target.value)}
              />

              <InputField
                id="brn"
                label="BRN No."
                placeholder="Enter BRN No."
                value={BRN}
                onChange={(e) => setBRN(e.target.value)}
              />

              <InputField
                id="industry"
                label="Industry"
                placeholder="Enter industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />

              <InputField
                id="status"
                label="Status"
                placeholder="Enter status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 xl:gap-6 mb-6">
              <InputField
                id="contact_first_name"
                label="Contact First Name"
                placeholder="Enter first name"
                value={contactFirstName}
                onChange={(e) => setContactFirstName(e.target.value)}
              />

              <InputField
                id="contact_last_name"
                label="Contact Last Name"
                placeholder="Enter last name"
                value={contactLastName}
                onChange={(e) => setContactLastName(e.target.value)}
              />

              <InputField
                id="contact_phone"
                label="Contact Phone"
                placeholder="Enter phone number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />

              <InputField
                id="contact_email"
                label="Contact Email"
                placeholder="Enter email address"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </>
        )}
        {/* 
        {activeTab === "siteInfo" && (
          <>
            <h2 className="text-2xl font-bold mb-4 xl:mb-6">Site Info</h2>
            <SiteTable
              onSelectSite={handleSelectSite}
              selectedSite={selectedSite}
            />
          </>
        )}

        {activeTab === "equipmentInfo" && (
          <>
            <h2 className="text-2xl font-bold mb-4 xl:mb-6">Equipment Info</h2>
            <EquipmentTable
              onSelectEquipment={handleSelectEquipment}
              selectedEquipment={selectedEquipment}
            />
          </>
        )} */}

        <button
          type="submit"
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
        >
          Save Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomerPage;
