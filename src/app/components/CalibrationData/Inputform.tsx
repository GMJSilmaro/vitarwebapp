"use client";

import React, { useEffect, useState } from "react";

const Inputform = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    // Avoid rendering dynamic parts until the component is mounted on the client
    return null;
  }

  return (
    <div className="p-4">
      <form>
        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
          <div>
            <label
              htmlFor="certificate_No"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Certificate No.
            </label>
            <input
              type="text"
              id="certificate_No"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>
          <div>
            <label
              htmlFor="submitted_by"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Submitted By:
            </label>
            <select
              id="submitted_by"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="" disabled selected>
                Select Submitter
              </option>
              <option value="vince">Vince</option>
              <option value="gilbert">Gilbert</option>
              <option value="chris">Chris</option>
            </select>
          </div>
        </div>

        {/* Date Pickers */}
        <div className="grid gap-2 xl:gap-4  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="mb-6">
            <label
              htmlFor="date_issued"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Date Issued:
            </label>
            <input
              type="date"
              id="date_issued"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="date_received"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Date Received:
            </label>
            <input
              type="date"
              id="date_received"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="date_calibrated"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Date Calibrated:
            </label>
            <input
              type="date"
              id="date_calibrated"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="date_due"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Due Date:
            </label>
            <input
              type="date"
              id="date_due"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
        </div>

        {/* Description text Area */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
            placeholder="Enter a description"
            required
          />
        </div>

        {/* Make, Model and Description */}
        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
          <div>
            <label
              htmlFor="make"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Make:
            </label>
            <input
              type="text"
              id="make"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>

          {/* Make */}

          <div>
            <label
              htmlFor="model"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Model:
            </label>
            <input
              type="text"
              id="model"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>

          {/* Serial No. */}

          <div>
            <label
              htmlFor="serial_no"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Serial No:
            </label>
            <input
              type="text"
              id="serial_no"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>

          {/* Accuracy Class / Type */}
          <div>
            <label
              htmlFor="class_type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Accuracy Class / Type :
            </label>
            <input
              type="text"
              id="class_type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>

          {/* Material */}
          <div>
            <label
              htmlFor="material"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material:
            </label>
            <input
              type="text"
              id="material"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>
        </div>

        <div className="grid gap-2 xl:gap-4 mb-6 rid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="amb_temp"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Ambient Tempearature *C:
            </label>
            <input
              type="text"
              id="amb_temp"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>
          <div>
            <label
              htmlFor="rel_humidity"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Relative Humidity (%r.h.):
            </label>
            <input
              type="text"
              id="rel_humidity"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="athmos_press"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Athmospheric Pressure (mbar):
            </label>
            <input
              type="text"
              id="athmos_press"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="ref_instruments"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Reference Instruments
          </label>
          <textarea
            id="ref_instruments"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
            placeholder="Enter Reference Instruments"
            required
          />
        </div>

        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
          <div>
            <label
              htmlFor="calibrated_by"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Calibrated By:
            </label>
            <input
              type="text"
              id="calibrated_by"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>

          <div>
            <label
              htmlFor="approved_by"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Approved Signatory:
            </label>
            <input
              type="text"
              id="approved_by"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ex.1001-250"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Inputform;
