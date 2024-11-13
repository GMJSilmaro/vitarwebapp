"use client";
import React, { useState, useEffect } from "react";
import { Site } from "@/app/types/Site";
import { db } from "@/app/firebase/config";
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  where,
  // setDoc,
} from "firebase/firestore";
import Button from "@/app/components/common/Button";
import EditSiteModal from "@/app/components/Site/EditSiteModal";
import AddSiteModal from "@/app/components/Site/AddSiteModal";
import Swal from "sweetalert2";

const SitePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for AddSiteModal
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const fetchSites = () => {
    const siteCollectionRef = collection(db, "site");

    const unsubscribe = onSnapshot(siteCollectionRef, (snapshot) => {
      const siteList: Site[] = snapshot.docs.map((doc) => ({
        siteID: doc.id,
        ...doc.data(),
      })) as Site[];

      console.log("Fetched sites:", siteList); // Log fetched data
      setSites(siteList);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchSites();
    return () => unsubscribe();
  }, []);

  const filteredSites = sites.filter((site) =>
    site.siteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSites.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredSites.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true); // Open the AddSiteModal
  };

  const toggleDropdown = (siteId: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  const handleEdit = (site: Site) => {
    setSelectedSite(site);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (siteId: string) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const siteRef = doc(db, "site", siteId);
        await deleteDoc(siteRef);

        const customerCollection = collection(db, "customerInfo");
        const customerSnapshot = await getDocs(customerCollection);

        const deletePromises: Promise<void>[] = [];

        for (const customerDoc of customerSnapshot.docs) {
          const customerId = customerDoc.id;
          const siteInfoCollection = collection(
            db,
            `customerInfo/${customerId}/siteInfo`
          );
          const siteInfoQuery = query(
            siteInfoCollection,
            where("siteID", "==", siteId)
          );
          const siteInfoSnapshot = await getDocs(siteInfoQuery);

          siteInfoSnapshot.docs.forEach((siteInfoDoc) => {
            const siteInfoRef = doc(siteInfoCollection, siteInfoDoc.id);
            deletePromises.push(deleteDoc(siteInfoRef));
          });
        }

        await Promise.all(deletePromises);

        setSites((prev) => prev.filter((site) => site.siteID !== siteId));

        Swal.fire(
          "Deleted!",
          "Your site and related site info have been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting site:", error);
        Swal.fire("Error!", "There was an error deleting your site.", "error");
      }
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSite(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdate = (updatedSite: Site) => {
    setSites((prev) =>
      prev.map((site) =>
        site.siteID === updatedSite.siteID ? updatedSite : site
      )
    );
    closeEditModal();
  };

  // const handleAddSite = async (newSite: Site) => {
  //   try {
  //     const siteRef = doc(collection(db, "site"));
  //     await setDoc(siteRef, newSite); // Add the new site to Firestore
  //   //  setSites((prev) => [...prev, { siteID: siteRef.id, ...newSite }]); // Update local state
  //     Swal.fire("Success!", "New site added successfully!", "success");
  //     closeAddModal(); // Close the modal after adding
  //   } catch (error) {
  //     console.error("Error adding site: ", error);
  //     Swal.fire("Error!", "There was an error adding the site.", "error");
  //   }
  // };

  return (
    <div className="p-8 lg:p-12 bg-white h-screen overflow-hidden">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4 py-8 lg:mb-0">
        Sites
      </h1>
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex gap-4 mb-4 lg:mb-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by site name..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
          <select
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="5">5 entries per page</option>
            <option value="10">10 entries per page</option>
            <option value="20">20 entries per page</option>
          </select>
        </div>

        <Button type="button" label="Add Site" onClick={handleAdd} />
      </div>

      <div className="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md h-[500px]">
        <table className="w-full text-sm text-left text-gray-600 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">
                Site ID
              </th>
              <th scope="col" className="px-6 py-3">
                Site Name
              </th>
              <th scope="col" className="px-6 py-3">
                Street 1
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3">
                Postcode
              </th>
              <th scope="col" className="px-6 py-3">
                Country
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {currentEntries.length > 0 ? (
              currentEntries.map((site) => (
                <tr key={site.siteID} className="border-b border-gray-200">
                  <td className="px-6 py-4">{site.siteID}</td>
                  <td className="px-6 py-4">{site.siteName}</td>
                  <td className="px-6 py-4">{site.street1}</td>
                  <td className="px-6 py-4">{site.city}</td>
                  <td className="px-6 py-4">{site.postCode}</td>
                  <td className="px-6 py-4">{site.country}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleDropdown(site.siteID)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      ⋮
                    </button>
                    {dropdownOpen[site.siteID] && (
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-2">
                        <button
                          onClick={() => handleEdit(site)}
                          className="block px-4 py-2 text-blue-600 hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(site.siteID)}
                          className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  No sites found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <span className="mx-2 text-black">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {isEditModalOpen && selectedSite && (
        <EditSiteModal
          site={selectedSite}
          onClose={closeEditModal}
          onUpdate={handleUpdate}
        />
      )}

      {isAddModalOpen && (
        <AddSiteModal
          isOpen
          onClose={closeAddModal}
          onAddSite={handleAdd} // Pass the function to handle adding a site
        />
      )}
    </div>
  );
};

export default SitePage;
