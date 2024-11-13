/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import InputField from "@/app/components/common/InputField";
import Button from "@/app/components/common/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import DisabledField from "../common/DisabledField";

// Create a custom component to handle map clicks
const MapClickHandler = ({
  setCoordinates,
}: {
  setCoordinates: (coords: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      setCoordinates([e.latlng.lat, e.latlng.lng]); // Set the latitude and longitude based on click
    },
  });

  return null; // This component does not render anything itself
};

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSite: (site: {
    siteID: string;
    siteName: string;
    street1: string;
    street2: string;
    street3: string;
    city: string;
    state: string; // Added state
    postCode: string;
    country: string;
    coordinates: [number, number] | null;
  }) => void; // Add the onAddSite function type
}

const AddSiteModal: React.FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  onAddSite,
}) => {
  const [siteID, setSiteID] = useState("");
  const [siteName, setSiteName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [street3, setStreet3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(""); // New state for state input
  const [postCode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null); // Coordinates for the map pin

  // Fetch the latest siteID on component mount
  useEffect(() => {
    const fetchLatestSiteID = async () => {
      const q = query(collection(db, "site"), orderBy("siteID", "desc"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0].data().siteID; // Get the latest siteID
        const numberPart = parseInt(latestDoc.split("-")[1]); // Extract the numeric part
        const newSiteID = `S-${String(numberPart + 1).padStart(3, "0")}`; // Increment and format
        setSiteID(newSiteID); // Set the new siteID
      } else {
        setSiteID("S-001"); // Start with S-001 if no documents exist
      }
    };

    fetchLatestSiteID();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a reference to the document with the siteID as the ID
    const siteDocRef = doc(db, "site", siteID);

    const newSite = {
      siteID, // This should be in the format "S-xxx"
      siteName,
      street1,
      street2,
      street3,
      city,
      state,
      postCode,
      country,
      coordinates, // Include the coordinates in the new site
    };

    try {
      await setDoc(siteDocRef, newSite); // Use setDoc to set the document with the siteID
      Swal.fire("Success!", "Site added successfully.", "success"); // Show success alert
      onAddSite(newSite); // Call onAddSite function after adding
      onClose(); // Close modal after adding
    } catch (error) {
      console.error("Error adding site: ", error);
      Swal.fire("Error!", "There was an error adding the site.", "error"); // Show error alert
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        {" "}
        {/* Adjusted max width and padding */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 focus:outline-none transition duration-200"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          {" "}
          {/* Adjusted margin */}
          Add Site
        </h2>
        <form className="grid grid-cols-2 gap-2" onSubmit={handleSubmit}>
          <DisabledField
            id="site_id"
            label="Site ID"
            placeholder="Enter Site ID"
            value={siteID}
          />
          <InputField
            id="site_name"
            label="Site Name"
            placeholder="Enter Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
          <InputField
            id="street_1"
            label="Street 1"
            placeholder="Enter Street 1"
            value={street1}
            onChange={(e) => setStreet1(e.target.value)}
          />
          <InputField
            id="street_2"
            label="Street 2"
            placeholder="Enter Street 2"
            value={street2}
            onChange={(e) => setStreet2(e.target.value)}
          />
          <InputField
            id="street_3"
            label="Street 3"
            placeholder="Enter Street 3"
            value={street3}
            onChange={(e) => setStreet3(e.target.value)}
          />
          <InputField
            id="city"
            label="City"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <InputField
            id="state"
            label="State"
            placeholder="Enter State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <InputField
            id="postcode"
            label="Postcode"
            placeholder="Enter Postcode"
            value={postCode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          <InputField
            id="country"
            label="Country"
            placeholder="Enter Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          {/* Map for pinning the site location */}
          <div className="col-span-2">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              {" "}
              {/* Adjusted margin */}
              Select Location
            </h3>
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              className="h-48 w-full" // Adjusted height
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler setCoordinates={setCoordinates} />
              {coordinates && (
                <Marker
                  position={coordinates}
                  icon={L.icon({
                    iconUrl: "/marker-icon.png",
                    iconSize: [25, 41],
                  })}
                />
              )}
            </MapContainer>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Click on the map to pin the location.
              </p>
            </div>
          </div>
        </form>
        <div className="flex items-end justify-end">
          <Button type="button" label="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddSiteModal;
