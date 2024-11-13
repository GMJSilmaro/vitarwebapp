"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // For dynamic routing

const EditCustomer: React.FC = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const router = useRouter();

  useEffect(() => {
    // Fetch the customer data using the ID (this can be fetched from an API or state management)
    // For now, we're simulating a fetch using the initial data
    const initialCustomers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Elm Street",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "234-567-8901",
        address: "456 Oak Avenue",
      },
      {
        id: "3",
        name: "Emily Johnson",
        email: "emily@example.com",
        phone: "345-678-9012",
        address: "789 Pine Road",
      },
    ];

    const foundCustomer = initialCustomers.find((c) => c.id === id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Save the customer data (e.g., API call)
    console.log("Customer saved:", customer);
    // Redirect back to the customers list
    router.push("/dashboard/customers");
  };

  return (
    <div className="p-6 lg:p-12 bg-white h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        Edit Customer
      </h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={customer.address}
          onChange={handleChange}
          className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
        />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Save
      </button>
    </div>
  );
};

export default EditCustomer;
