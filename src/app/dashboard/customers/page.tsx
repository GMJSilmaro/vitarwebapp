"use client";

import { useState, useEffect } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Customer, CustomerSite } from "@/app/types/Customer"; // Updated imports
import Button from "@/app/components/common/Button";
import { useRouter } from "next/navigation";
import AddCustomerSiteModal from "@/app/components/Customers/AddCustomerSiteModal";
import AddCustomerEquipmentModal from "@/app/components/Customers/AddCustomerEquipmentModal"; // Import modal

import Swal from "sweetalert2";
import { Equipment } from "@/app/types/Equipment";

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter] = useState("all");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [selectedCustomerID, setSelectedCustomerID] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedCustomerForEquipment, setSelectedCustomerForEquipment] =
    useState<string | null>(null);

  const handleAddSiteClick = (customerID: string) => {
    setSelectedCustomerID(customerID);
    setIsModalOpen(true);
  };

  const handleAddEquipmentClick = (customerID: string) => {
    setSelectedCustomerForEquipment(customerID);
    setIsEquipmentModalOpen(true);
  };

  const handleAddEquipment = async (selectedEquipment: Equipment[]) => {
    if (!selectedCustomerForEquipment) return;

    // Debugging: log selectedEquipment to check for undefined values
    console.log("Selected Equipment for Addition:", selectedEquipment);

    // Format selected equipment to ensure each item has the correct structure
    const formattedEquipment = selectedEquipment
      .map((equip) => {
        // Log the whole equipment object for debugging
        console.log("Inspecting Equipment Entry:", equip);

        // Check if required fields are defined
        if (equip.equipmentID && equip.equipmentName && equip.typeOfScope) {
          return {
            equipmentID: equip.equipmentID, // Required
            equipmentName: equip.equipmentName, // Required
            typeOfScope: equip.typeOfScope, // Required
            description: equip.description ?? null, // Optional
            tagID: equip.tagID ?? null, // Optional
            make: equip.make ?? null, // Optional
            model: equip.model ?? null, // Optional
            serialNumber: equip.serialNumber ?? null, // Optional
            rangeType: equip.rangeType ?? null, // Optional
            rangeMinTemp: equip.rangeMinTemp ?? null, // Optional
            rangeMaxTemp: equip.rangeMaxTemp ?? null, // Optional
            rangeMinPercent: equip.rangeMinPercent ?? null, // Optional
            rangeMaxPercent: equip.rangeMaxPercent ?? null, // Optional
            certificateNo: equip.certificateNo ?? null, // Optional
            traceability: equip.traceability ?? null, // Optional
          };
        } else {
          console.warn(
            "Skipping invalid equipment entry due to missing fields:",
            equip
          );
          return null; // Return null for invalid entries
        }
      })
      .filter((equip) => equip !== null); // Filter out null values

    // Debugging: log formattedEquipment after formatting
    console.log("Formatted Equipment for Addition:", formattedEquipment);

    if (formattedEquipment.length === 0) {
      console.warn("No valid equipment to add.");
      return; // Exit if there's no valid equipment
    }

    try {
      const customerRef = doc(db, "customerInfo", selectedCustomerForEquipment);

      // First, get the current data of the customer
      const customerDoc = await getDoc(customerRef);
      if (customerDoc.exists()) {
        const customerData = customerDoc.data();

        // Check if the equipment field exists and is an array
        if (!Array.isArray(customerData.equipment)) {
          // If not, initialize it as an empty array
          await updateDoc(customerRef, {
            equipment: [], // Initialize if it doesn't exist
          });
        }
      }

      // Now add the formatted equipment using arrayUnion
      await updateDoc(customerRef, {
        equipment: arrayUnion(...formattedEquipment),
      });
      console.log("Equipment added successfully!");
    } catch (error) {
      console.error("Error adding equipment:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error adding the equipment!",
      });
    }
  };

  const fetchCustomers = () => {
    const customerCollection = collection(db, "customerInfo");

    // Set up the real-time listener for the customer collection
    const unsubscribe = onSnapshot(
      customerCollection,
      async (customerQuerySnapshot) => {
        try {
          // Fetch all customers
          const fetchedCustomers: Customer[] = await Promise.all(
            customerQuerySnapshot.docs.map(async (doc) => {
              const customerData = doc.data();
              const customerID = customerData.customerID || ""; // Extract customerID

              return {
                customerID: customerID, // Use the extracted customerID
                customerName: customerData.customerName || "",
                email: customerData.contact?.[0]?.contactEmail || "",
                phone: customerData.contact?.[0]?.contactPhone || "",
                address: customerData.address || "",
                BRN: customerData.BRN || "",
                TIN: customerData.TIN || "",
                industry: customerData.industry || "",
                status: customerData.status || "",
                contactFirstName:
                  customerData.contact?.[0]?.contactFirstName || "",
                contactLastName:
                  customerData.contact?.[0]?.contactLastName || "",
                contactPhone: customerData.contact?.[0]?.contactPhone || "",
                contactEmail: customerData.contact?.[0]?.contactEmail || "",
                equipment: customerData.equipment || [], // Fetch equipment from the customer data
                sites: [], // Placeholder for sites
              };
            })
          );

          // Fetch sites for all customers in parallel
          const sitePromises = fetchedCustomers.map(async (customer) => {
            const siteCollection = collection(
              db,
              "customerInfo",
              customer.customerID,
              "siteInfo"
            ); // Use customer.customerID here
            const siteQuerySnapshot = await getDocs(siteCollection);

            const sites: CustomerSite[] = siteQuerySnapshot.docs.map(
              (siteDoc) => siteDoc.data() as CustomerSite
            );

            customer.sites = sites; // Assign the fetched sites to the customer
          });

          // Wait for all site fetches to complete
          await Promise.all(sitePromises);

          // Finally, update the state with all fetched customers
          setCustomers(fetchedCustomers);
        } catch (error) {
          console.error("Error processing customer data:", error);
        }
      }
    );

    // Return the unsubscribe function to clean up the listener when the component unmounts
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchCustomers();
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const router = useRouter();
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      customer.contactPhone
        .toLowerCase()
        .includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / entriesPerPage)
  );
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCustomers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handleRowClick = (customerID: string) => {
    router.push(`./customers/${customerID}/view/`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  const handleAdd = () => {
    router.push("./customers/add");
  };

  const handleDelete = (customerID: string) => {
    console.log("Delete customer", customerID);
  };

  return (
    <div className="p-8 lg:p-12 bg-white h-screen overflow-x-hidden">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4 py-8 lg:mb-0">
        Customers
      </h1>
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex gap-4 mb-4 lg:mb-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <Button type="button" label="Add Customer" onClick={handleAdd} />
      </div>

      {/* Table with sticky header and fixed height */}
      <div className="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md h-[500px]">
        <table className="w-full text-sm text-left text-gray-600 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                Customer ID
              </th>
              <th scope="col" className="px-6 py-3">
                Customer Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Sites
              </th>
              <th scope="col" className="px-6 py-3">
                Equipment
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto text-center">
            {currentEntries.length > 0 ? (
              currentEntries.map((customer) => (
                <tr
                  key={customer.customerID}
                  onClick={() => handleRowClick(customer.customerID)}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {customer.customerID}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {customer.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.contactEmail}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.contactPhone}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.sites &&
                    Array.isArray(customer.sites) &&
                    customer.sites.length > 0 ? (
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "View Sites",
                            text: `Do you want to view the sites?`,
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, show me!",
                            cancelButtonText: "No, thanks",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              console.log(
                                "Viewing sites for customer:",
                                customer.customerID
                              );
                            }
                          });
                        }}
                        className="text-gray-500 underline hover:text-gray-700"
                      >
                        {customer.sites.length} sites
                      </button>
                    ) : (
                      <p>No sites assigned</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.equipment && customer.equipment.length > 0 ? (
                      <p>{customer.equipment.length} equipment </p>
                    ) : (
                      <p>No equipment assigned</p>
                    )}
                  </td>
                  <td className="px-6 py-4 ">
                    {/* Three-dot menu button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when clicking the button
                        setDropdownOpen((prev) => ({
                          ...prev,
                          // Use customerID here for menu toggle
                          [customer.customerID]: !prev[customer.customerID],
                        }));
                      }}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      ⋮
                    </button>
                    {/* Dropdown Menu */}
                    {dropdownOpen[customer.customerID] && (
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when clicking Add Site
                            handleAddSiteClick(customer.customerID);
                          }}
                          className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                        >
                          Add Site
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddEquipmentClick(customer.customerID);
                          }}
                          className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                        >
                          Add Equipment
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when clicking Delete
                            handleDelete(customer.customerID);
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [customer.customerID]: false,
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
                  No customers found.
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
        <div>
          <label className="text-gray-600 mr-2">Entries per page:</label>
          <select
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <AddCustomerSiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerID={selectedCustomerID!} // Ensure customerID is not null
      />

      <AddCustomerEquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onAdd={handleAddEquipment}
      />
    </div>
  );
};

export default CustomersPage;
