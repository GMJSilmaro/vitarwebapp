"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Customer, CustomerSite } from "@/app/types/Customer";
import { useRouter } from "next/navigation";
import { Tab } from "@headlessui/react";

const CustomerDetailPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Access the 'id' parameter
  const customerID = id;
  const router = useRouter();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerID || typeof customerID !== "string") {
        console.log("Invalid customerID:", customerID);
        setLoading(false);
        return;
      }

      try {
        const customerDocRef = doc(db, "customerInfo", customerID);
        const customerDocSnap = await getDoc(customerDocRef);

        if (customerDocSnap.exists()) {
          const customerData = customerDocSnap.data();
          const fetchedCustomer: Customer = {
            customerID: customerData.customerID || "",
            customerName: customerData.customerName || "",
            email: customerData.contact?.[0]?.contactEmail || "",
            phone: customerData.contact?.[0]?.contactPhone || "",
            address: customerData.address || "",
            BRN: customerData.BRN || "",
            TIN: customerData.TIN || "",
            industry: customerData.industry || "",
            status: customerData.status || "",
            contactFirstName: customerData.contact?.[0]?.contactFirstName || "",
            contactLastName: customerData.contact?.[0]?.contactLastName || "",
            contactPhone: customerData.contact?.[0]?.contactPhone || "",
            contactEmail: customerData.contact?.[0]?.contactEmail || "",
            equipment: customerData.equipment || [], // Fetch equipment from the customer data
            sites: [], // Placeholder for sites
          };

          // Fetch site information if it exists
          try {
            const siteCollection = collection(
              db,
              "customerInfo",
              customerID,
              "siteInfo"
            );
            const siteQuerySnapshot = await getDocs(siteCollection);
            fetchedCustomer.sites = siteQuerySnapshot.docs.map(
              (siteDoc) => siteDoc.data() as CustomerSite
            );
          } catch (error) {
            console.warn("No siteInfo collection found:", error);
          }

          setCustomer(fetchedCustomer);
        } else {
          console.error("Customer not found");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerID]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Customer not found.</div>;
  }

  return (
    <div className="p-8 lg:p-12 bg-white h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        {customer.customerName}
      </h1>

      <div className="mb-8 text-black">
        <h2 className="text-2xl font-semibold text-gray-800">
          Customer Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <p>
            <strong>Customer ID:</strong> {customer.customerID}
          </p>
          <p>
            <strong>Email:</strong> {customer.contactEmail}
          </p>
          <p>
            <strong>Phone:</strong> {customer.contactPhone}
          </p>
          <p>
            <strong>Address:</strong> {customer.address}
          </p>
          <p>
            <strong>BRN:</strong> {customer.BRN}
          </p>
          <p>
            <strong>TIN:</strong> {customer.TIN}
          </p>
          <p>
            <strong>Industry:</strong> {customer.industry}
          </p>
          <p>
            <strong>Status:</strong> {customer.status}
          </p>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b">
          <Tab
            className={({ selected }) =>
              classNames(
                "py-2 px-4 font-semibold",
                selected
                  ? "border-b-2 border-red-600 text-red-500"
                  : "text-gray-500"
              )
            }
          >
            Sites
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "py-2 px-4 font-semibold",
                selected
                  ? "border-b-2 border-red-600 text-red-500"
                  : "text-gray-500"
              )
            }
          >
            Equipment
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel>
            {customer.sites && customer.sites.length > 0 ? (
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Site Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      City
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      State
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Post Code
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {customer.sites.map((site, index) => (
                    <tr key={index} className="border-b text-black">
                      <td className="px-4 py-2">{site.siteName}</td>
                      <td className="px-4 py-2">{`${site.street1}, ${
                        site.street2 ? site.street2 + "," : ""
                      } ${site.street3 ? site.street3 + "," : ""}`}</td>
                      <td className="px-4 py-2">{site.city}</td>
                      <td className="px-4 py-2">{site.state}</td>
                      <td className="px-4 py-2">{site.postCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-black">No sites available.</p>
            )}
          </Tab.Panel>
          <Tab.Panel>
            {customer.equipment && customer.equipment.length > 0 ? (
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Equipment ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Equipment Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tag ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customer.equipment.map((equip, index) => (
                    <tr key={index} className="border-b text-black">
                      <td className="px-4 py-2">{equip.equipmentID}</td>
                      <td className="px-4 py-2">{equip.equipmentName}</td>
                      <td className="px-4 py-2">{equip.typeOfScope}</td>
                      <td className="px-4 py-2">{equip.tagID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-black">No equipment available.</p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <button
        onClick={() => router.back()}
        className="mt-8 px-4 py-2 font-semibold text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
      >
        Back to Customers
      </button>
    </div>
  );
};

export default CustomerDetailPage;
