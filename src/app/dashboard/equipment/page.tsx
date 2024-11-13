"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Equipment } from "@/app/types/Equipment";
import { db } from "@/app/firebase/config"; // Ensure this is the correct path
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore"; // Import Firestore methods
import Button from "@/app/components/common/Button"; // Import your Button component

const EquipmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedFilter, setSelectedFilter] = useState("all");
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [scopeFilter, setScopeFilter] = useState("all"); // New state for scope filter
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const router = useRouter();

  // Fetch equipment data from Firestore
  useEffect(() => {
    const equipmentCollectionRef = collection(db, "equipment");

    // Set up a real-time listener
    const unsubscribe = onSnapshot(equipmentCollectionRef, (snapshot) => {
      const equipmentList: Equipment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Equipment[];
      setEquipments(equipmentList);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (equipmentId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this equipment?"
    );

    if (confirmDelete) {
      try {
        // Create a reference to the equipment document
        const equipmentRef = doc(db, "equipment", equipmentId);

        // Delete the document from Firestore
        await deleteDoc(equipmentRef);

        // Update local state
        setEquipments((prev) =>
          prev.filter((equipment) => equipment.equipmentID !== equipmentId)
        );

        console.log(`Equipment with ID ${equipmentId} deleted`);
        // Optionally, trigger a refresh or navigate away
        router.push(`/dashboard/equipment`);
      } catch (error) {
        console.error("Error deleting equipment: ", error);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedFilter(e.target.value);
  // };

  const handleScopeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScopeFilter(e.target.value); // Update scope filter
  };

  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch =
      equipment.equipmentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ?? false;
    // const matchesFilter =
    //   (selectedFilter === "all" ||
    //     equipment.siteName
    //       ?.toLowerCase()
    //       .includes(selectedFilter.toLowerCase())) ??
    //   false;
    const matchesScopeFilter =
      scopeFilter === "all" || equipment.typeOfScope === scopeFilter; // Filter by type of scope
    return matchesSearch && matchesScopeFilter; //matchesFilter
  });

  // Pagination setup
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEquipments.length / entriesPerPage)
  );
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEquipments.slice(
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
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="p-8 lg:p-12 bg-white h-screen overflow-x-hidden">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4 py-8 lg:mb-0">
        Equipments
      </h1>
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex gap-4 mb-4 lg:mb-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by equipment name..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
          {/* <select
            value={selectedFilter}
            onChange={handleFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="all">All Locations</option>
            <option value="Site A">Site A</option>
            <option value="Site B">Site B</option>
            <option value="Site C">Site C</option>
          </select> */}
          <select
            value={scopeFilter}
            onChange={handleScopeFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="all">All Types of Scope</option>
            <option value="Temperature">Temperature</option>
            <option value="Pressure">Pressure</option>
            <option value="Humidity">Humidity</option>
            {/* Add more types of scope as needed */}
          </select>
        </div>
        <Button
          type="button"
          label="Add Equipment"
          onClick={() => router.push("./equipment/add")}
        />
      </div>

      {/* Table with sticky header and fixed height */}
      <div className="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md h-[500px]">
        <table className="w-full text-sm text-left text-gray-600 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">
                Equipment ID
              </th>
              <th scope="col" className="px-6 py-3">
                Equipment Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type of Scope
              </th>
              <th scope="col" className="px-6 py-3">
                Tag ID
              </th>
              <th scope="col" className="px-6 py-3">
                Make
              </th>
              <th scope="col" className="px-6 py-3">
                Model
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {currentEntries.length > 0 ? (
              currentEntries.map((equipment) => (
                <tr
                  key={equipment.equipmentID}
                  className="border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {equipment.equipmentID}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {equipment.equipmentName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {equipment.typeOfScope}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{equipment.tagID}</td>
                  <td className="px-6 py-4 text-gray-600">{equipment.make}</td>
                  <td className="px-6 py-4 text-gray-600">{equipment.model}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        setDropdownOpen((prev) => ({
                          ...prev,
                          [equipment.equipmentID]: !prev[equipment.equipmentID],
                        }))
                      }
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      ⋮
                    </button>
                    {/* Dropdown Menu */}
                    {dropdownOpen[equipment.equipmentID] && (
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-2">
                        <button
                          onClick={() => {
                            handleDelete(equipment.equipmentID);
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [equipment.equipmentID]: false,
                            }));
                          }}
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
                  No equipment found.
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
          <span className="mx-2 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages < 1}
            className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
              currentPage === totalPages || totalPages < 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
        <div>
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
      </div>
    </div>
  );
};

export default EquipmentPage;
