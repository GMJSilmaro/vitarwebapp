/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Site } from "@/app/types/Site";
import { db } from "@/app/firebase/config";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import Button from "../common/Button";

interface EditSiteModalProps {
  site: Site; // The site to edit
  onClose: () => void; // Function to close the modal
  onUpdate: (updatedSite: Site) => void; // Function to handle the updated site
}

const EditSiteModal: React.FC<EditSiteModalProps> = ({
  site,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Site | null>(null);

  useEffect(() => {
    if (site) {
      setFormData(site); // Use the 'site' prop
    }
  }, [site]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : prevData
    );
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      const updateData = { ...formData } as { [key: string]: any };

      // Update site in the "site" collection
      const siteRef = doc(db, "site", formData.siteID);
      await updateDoc(siteRef, updateData);

      // Update siteInfo in related "customerInfo" collections
      const customerCollection = collection(db, "customerInfo");
      const customerSnapshot = await getDocs(customerCollection);
      const updatePromises: Promise<void>[] = [];

      for (const customerDoc of customerSnapshot.docs) {
        const customerId = customerDoc.id;

        const siteInfoCollection = collection(
          db,
          `customerInfo/${customerId}/siteInfo`
        );
        const siteInfoQuery = query(
          siteInfoCollection,
          where("siteID", "==", formData.siteID)
        );
        const siteInfoSnapshot = await getDocs(siteInfoQuery);

        siteInfoSnapshot.docs.forEach((siteInfoDoc) => {
          const siteInfoRef = doc(siteInfoCollection, siteInfoDoc.id);
          updatePromises.push(updateDoc(siteInfoRef, updateData));
        });
      }

      await Promise.all(updatePromises);
      Swal.fire("Success", "Site updated successfully.", "success");

      onUpdate(formData); // Pass the updated data back
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating site: ", error);
      Swal.fire("Error", "There was an error updating the site.", "error");
    }
  };

  if (!formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit Site
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site ID
            </label>
            <input
              type="text"
              name="siteID"
              value={formData.siteID}
              onChange={handleInputChange}
              placeholder="Site ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleInputChange}
              placeholder="Site Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street 1
            </label>
            <input
              type="text"
              name="street1"
              value={formData.street1}
              onChange={handleInputChange}
              placeholder="Street 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street 2
            </label>
            <input
              type="text"
              name="street2"
              value={formData.street2}
              onChange={handleInputChange}
              placeholder="Street 2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street 3
            </label>
            <input
              type="text"
              name="street3"
              value={formData.street3}
              onChange={handleInputChange}
              placeholder="Street 3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postcode
            </label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleInputChange}
              placeholder="Postcode"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <Button type="button" label="Cancel" onClick={onClose} />
          <Button type="button" label="Edit Site" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default EditSiteModal;
