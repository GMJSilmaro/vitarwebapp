/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
// import InputField from "@/app/components/common/InputField";
import DisabledField from "@/app/components/common/DisabledField";
import SearchDropdown from "@/app/components/Jobs/JobCustomerNameDropdown"; // Customer dropdown
import SiteDropdown from "@/app/components/Jobs/JobSiteNameDropdown"; // Import the SiteDropdown component
import { Site } from "@/app/types/CustomerSiteInfo";
import { useRouter } from "next/navigation";
import SearchDropdownWithTagging from "@/app/components/Jobs/JobSearchDropDownTagging";
import Swal from "sweetalert2";

interface SiteData {
  siteID: string;
  siteName: string;
  siteStreet1: string;
  siteStreet2: string;
  siteStreet3: string;
  siteCity: string;
  siteState: string;
  siteCountry: string;
  sitePostCode: string;
}

const predefinedTimes = {
  morning: "09:00", // Example time for morning
  afternoon: "13:00", // Example time for afternoon
  evening: "17:00", // Example time for evening
};

const AddJobPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("summary");

  // State management for input fields
  const [customerName, setCustomerName] = useState("");
  const [contactName, setContactName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const [selectedTimeWindow, setSelectedTimeWindow] = useState("");
  const [specificTime, setSpecificTime] = useState("");

  const router = useRouter();

  // New state for site selection
  const [siteID, setSiteID] = useState("");
  const [siteName, setSiteName] = useState(""); // Stores the selected site
  const [customerID, setCustomerID] = useState(""); // Stores the selected customerID for SiteDropdown

  //SITE

  const [siteStreet1, setSiteStreet1] = useState("");
  const [siteStreet2, setSiteStreet2] = useState("");
  const [siteStreet3, setSiteStreet3] = useState("");
  const [siteCity, setSiteCity] = useState("");
  const [siteState, setSiteState] = useState("");
  const [siteCountry, setSiteCountry] = useState("");
  const [sitePostCode, setSitePostCode] = useState("");

  const handleTimeWindowChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTimeWindow(value);

    if (value === "specific_time") {
      // Reset specific time to empty if switching to specific time
      setSpecificTime("");
    }
  };

  useEffect(() => {
    if (selectedTimeWindow === "morning") {
      setSpecificTime(predefinedTimes.morning);
    } else if (selectedTimeWindow === "afternoon") {
      setSpecificTime(predefinedTimes.afternoon);
    } else if (selectedTimeWindow === "evening") {
      setSpecificTime(predefinedTimes.evening);
    }
  }, [selectedTimeWindow]);

  // When a customer is selected from the SearchDropdown
  const handleCustomerSelect = async (selectedOption: string) => {
    // Split the selected option to get customerID and customerName
    const [customerID, customerName] = selectedOption.split(" - ");

    // Set the state for customerID and customerName (displayed value)
    setCustomerID(customerID);
    setCustomerName(`${customerID} - ${customerName}`);

    // Fetch customer details from Firestore using the customerID
    const customerQuery = query(
      collection(db, "customerInfo"),
      where("customerID", "==", customerID) // Query by customerID
    );

    try {
      const querySnapshot = await getDocs(customerQuery);
      if (!querySnapshot.empty) {
        const customerData = querySnapshot.docs[0].data();
        // Update state with customer details
        setContactName(customerData.customerName || "");
        setFirstName(customerData.contactFirstName || "");
        setLastName(customerData.contactLastName || "");
        setPhoneNumber(customerData.contactPhone || "");
        setMobilePhone(customerData.mobilePhone || "");
        setEmailAddress(customerData.contactEmail || "");
      } else {
        // Reset fields if no customer is found
        setContactName("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setMobilePhone("");
        setEmailAddress("");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const handleNextTab = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Validation function for the "summary" tab
    const validateSummary = () => {
      return customerName.trim() !== "" && contactName.trim() !== ""; // Add more fields as needed
    };

    // Validation function for the "location" tab
    const validateLocation = () => {
      return (
        siteID.trim() !== "" && // Assuming siteID is required
        siteStreet1.trim() !== "" &&
        siteCity.trim() !== "" &&
        siteState.trim() !== ""
      ); //
    };

    // Validation function for the "scheduling" tab
    const validateScheduling = () => {
      // Replace this with your actual validation logic
      const isValid = true; // Assume true for example
      return isValid;
    };

    // Handle tab navigation and validation
    if (activeTab === "summary") {
      if (validateSummary()) {
        setActiveTab("location");
      } else {
        Swal.fire(
          "Error",
          "Please fill in all required fields in the summary tab.",
          "error"
        );
      }
    } else if (activeTab === "location") {
      if (validateLocation()) {
        setActiveTab("scheduling");
      } else {
        Swal.fire(
          "Error",
          "Please fill in all required fields in the location tab.",
          "error"
        );
      }
    } else if (activeTab === "scheduling") {
      if (validateScheduling()) {
        // Show SweetAlert confirmation
        const result = await Swal.fire({
          title: "Confirm Scheduling",
          text: "Are you sure you want to schedule the job?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, schedule it!",
          cancelButtonText: "No, cancel!",
        });

        if (result.isConfirmed) {
          // Proceed with scheduling the job
          console.log("Job is being scheduled...");
          // Here, you can also handle any state reset or submission logic

          // Show success message
          Swal.fire(
            "Scheduled!",
            "Your job has been scheduled.",
            "success"
          ).then(() => {
            // Refresh the page after scheduling
            window.location.reload();
          });
        }
      } else {
        Swal.fire(
          "Error",
          "Please fill in all required fields in the scheduling tab.",
          "error"
        );
      }
    }
  };

  // When a site is selected from the SiteDropdown
  const handleSiteSelect = async (selectedSite: string) => {
    const [siteID, siteName] = selectedSite.split(" - ");

    // Set the state for customerID and customerName (displayed value)
    setSiteID(siteID);
    setSiteName(`${siteID} - ${siteName}`);

    const siteQuery = query(
      collection(db, "customerSiteInfo"),
      where("siteID", "==", siteID)
    );

    try {
      const querySnapshot = await getDocs(siteQuery);
      if (!querySnapshot.empty) {
        const siteData = querySnapshot.docs[0].data() as SiteData;

        setSiteStreet1(siteData.siteStreet1 || "");
        setSiteStreet2(siteData.siteStreet2 || "");
        setSiteStreet3(siteData.siteStreet3 || "");
        setSiteCity(siteData.siteCity || "");
        setSiteState(siteData.siteState || "");
        setSiteCountry(siteData.siteCountry || "");
        setSitePostCode(siteData.sitePostCode || "");
      }
    } catch (error) {
      console.error("Error fetching this site details", error);
    }
  };

  return (
    <div className="p-4 xl:p-12 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Add Job</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8 border-b">
        {["summary", "location", "scheduling"].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-4 py-2 border-b-2 ${
              activeTab === tab
                ? "border-red-600 text-red-600 font-semibold"
                : "border-transparent text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>

      <form className="space-y-6 text-black bg-gray-200 p-8 m-4">
        {activeTab === "summary" && (
          <div>
            <h2 className="text-2xl font-bold  xl:mb-6">Job Summary</h2>

            {/* Search Customer Name Input */}
            <SearchDropdown
              label="Search Customer Name"
              placeholder="Search by Customer Name"
              collectionName="customerInfo"
              value={customerName}
              onOptionSelect={handleCustomerSelect} // Pass the new handler here
            />

            <h2 className="text-xl font-bold xl:mt-8 xl:mb-4">
              Primary Contact
            </h2>
            <p className="mb-4 text-xs xl:text-sm">
              Details about the customer
            </p>

            {/* Contact Details Inputs */}
            <DisabledField
              id="contact_name"
              label="Contact Name"
              placeholder="Contact Name"
              value={contactName}
            />

            <div className="grid grid-cols-3 gap-4 xl:gap-6 mb-6">
              <DisabledField
                id="first_name"
                label="First Name"
                placeholder="ex. Contact Details"
                value={firstName}
              />
              <DisabledField
                id="middle_name"
                label="Middle Name"
                placeholder="ex. Contact Details"
                value={middleName}
              />
              <DisabledField
                id="last_name"
                label="Last Name"
                placeholder="ex. Contact Details"
                value={lastName}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 xl:gap-6 mb-6">
              <DisabledField
                id="phone_number"
                label="Phone Number"
                placeholder="ex. Contact Details"
                value={phoneNumber}
              />
              <DisabledField
                id="mobile_phone"
                label="Mobile Phone"
                placeholder="ex. Contact Details"
                value={mobilePhone}
              />
              <DisabledField
                id="email_address"
                label="Email Address"
                placeholder="ex. Contact Details"
                value={emailAddress}
              />
            </div>

            <hr className="my-6" />
          </div>
        )}

        {activeTab === "location" && (
          <div>
            <h2 className="text-2xl font-bold  mb-4">Job Location</h2>
            <p className="mb-4">Details about Job Location</p>

            {customerID && (
              <SiteDropdown
                label="Select Site"
                placeholder="Select a site"
                customerId={customerID} // Pass the selected customerID
                value={siteName} // Display the selected site
                onSiteSelect={handleSiteSelect} // Update when a site is selected
                collectionName={"customerSiteInfo"}
              />
            )}

            <div className="grid grid-cols-3 gap-4 xl:gap-6 mb-6 xl:mt-4">
              <DisabledField
                id="site_name"
                label="Site Name"
                placeholder="ex. Location Name"
                value={siteName}
              />
              <DisabledField
                id="street_no1"
                label="Street No 1."
                placeholder="ex. Street No 1."
                value={siteStreet1}
              />
              <DisabledField
                id="street_no1"
                label="Street No 2."
                placeholder="ex. Street No 2."
                value={siteStreet2}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <DisabledField
                id="block_no"
                label="Street 3"
                placeholder="ex. Street 3"
                value={siteStreet3}
              />
              <DisabledField
                id="building_no"
                label="Postcode"
                placeholder="ex. Postcode"
                value={sitePostCode}
              />
            </div>

            <div className="grid grid-col-2 xl:grid-cols-4 gap-6 mb-6">
              <DisabledField
                id="country"
                label="Country"
                placeholder="ex. Country"
                value={siteCountry}
              />
              <DisabledField
                id="state_province"
                label="State/Province"
                placeholder="ex. State/Province"
                value={siteState}
              />
              <DisabledField
                id="city"
                label="City"
                placeholder="ex. City"
                value={siteCity}
              />
              <DisabledField
                id="zip_postal"
                label="Zip/Postal Code"
                placeholder="ex. Zip/Postal Code"
                value={sitePostCode}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <DisabledField
                id="block_no"
                label="Block"
                placeholder="ex. "
                value="Auto-filled"
              />
              <DisabledField
                id="building_no"
                label="Building No."
                placeholder="ex. "
                value="Auto-filled"
              />
            </div>
          </div>
        )}

        {activeTab === "scheduling" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Job Scheduling</h2>

            {/* Job Number (auto-increment) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 col-span-1">
              <DisabledField
                id="job_number"
                label="Job Number"
                value="J-001" // Adjust dynamically based on your logic for incrementing
              />

              {/* Job Name */}
              <div className="col-span-3">
                <label
                  htmlFor="job_name"
                  className="block text-sm font-bold mb-2"
                >
                  Job Name
                </label>
                <input
                  type="text"
                  id="job_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <label
                htmlFor="job_description"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                Job Description
              </label>
              <textarea
                id="job_description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                rows={4}
                required
              ></textarea>
            </div>

            {/* Job Priority Selector */}
            <div className="grid grid-cols-3 gap-3">
              <div className="mb-6">
                <label
                  htmlFor="priority"
                  className="block mb-2 text-sm font-bold text-gray-900 "
                >
                  Job Priority
                </label>
                <select
                  id="priority"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="mid">Mid</option>
                  <option value="low">Low</option>
                </select>
              </div>
              {/* Job Status Selector */}
              <div className="mb-6">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Job Status
                </label>
                <select
                  id="status"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="created">Created</option>
                  <option value="confirm">Confirm</option>
                  <option value="cancel">Cancel</option>
                  <option value="job_started">Job Started</option>
                  <option value="job_completed">Job Completed</option>
                  <option value="validate">Validate</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {/* Job Workers (Tagging type) */}
              <div className="mb-6">
                <SearchDropdownWithTagging
                  label="Job Workers"
                  placeholder="Search and select workers"
                  collectionName="users"
                  onSelectionChange={(selectedWorkers) => {
                    // Handle selected workers here
                    console.log("Selected workers:", selectedWorkers);
                  }}
                />
              </div>
            </div>

            {/* Start Date, End Date, Start Time, End Time */}
            {/* Date Selector */}
            <div className="grid grid-cols-2 gap-4 w-1/2">
              <div className="mb-6">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="time_window"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Time Window
                </label>
                <select
                  id="time_window"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
                  required
                  value={selectedTimeWindow}
                  onChange={handleTimeWindowChange}
                >
                  <option value="" disabled>
                    Select a time window
                  </option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="specific_time">Set Specific Time</option>
                </select>
              </div>
            </div>

            {selectedTimeWindow === "specific_time" && (
              <div id="specific-time" className="mb-6">
                <label
                  htmlFor="specific_time"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Set Specific Time
                </label>
                <input
                  type="time"
                  id="specific_time"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={specificTime}
                  onChange={(e) => setSpecificTime(e.target.value)}
                />
              </div>
            )}

            {/* Specific Time Input (conditionally render based on selection) */}
            <div id="specific-time" className="mb-6 hidden">
              <label
                htmlFor="specific_time"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                Set Specific Time
              </label>
              <input
                type="time"
                id="specific_time"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
            </div>
            {/* Predefined Times Label */}
            <div className="mt-2 text-sm text-gray-600">
              <span className="mr-4">
                <strong>Morning:</strong> {predefinedTimes.morning}
              </span>
              <span className="mr-4">
                <strong>Afternoon:</strong> {predefinedTimes.afternoon}
              </span>
              <span>
                <strong>Evening:</strong> {predefinedTimes.evening}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end items-end">
          <div className="xl:w-1/6 w-full">
            <Button
              label={
                activeTab === "summary" || activeTab === "location"
                  ? "Next"
                  : "Schedule Job"
              }
              type="button"
              onClick={handleNextTab} // Add the onClick handler here
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddJobPage;
