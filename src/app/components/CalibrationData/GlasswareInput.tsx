"use client";

import React, { useEffect, useState } from "react";

const GlasswareInput = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    // Avoid rendering dynamic parts until the component is mounted on the client
    return null;
  }

  return (
    <div className="p-4 min-h-screen">
      <form>
        {/* Description text Area */}
        <div className="">
          <label
            htmlFor="description_glass"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description_glass"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
            placeholder="Enter a description"
            required
          />
        </div>
        <div className="pt-8 mb-6 xl:ml xl:pt-12 ">
          <h1 className="text-md xl:text-xl font-bold  text-black">
            Delivery Time (Only for Burette, Graduated Pipette & One Mark
            Pipette)
          </h1>
        </div>

        {/* Time */}
        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-4">
          <div>
            <label
              htmlFor="time_1"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Time 1 (S):
            </label>
            <input
              type="text"
              id="time_1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="N/A"
              required
            />
          </div>

          <div>
            <label
              htmlFor="time_2"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Time 2 (S):
            </label>
            <input
              type="text"
              id="time_2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="N/A"
              required
            />
          </div>

          <div>
            <label
              htmlFor="time_3"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Time 3 (S) :
            </label>
            <input
              type="text"
              id="time_3"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="N/A"
              required
            />
          </div>

          <div>
            <label
              htmlFor="average"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Average (S):
            </label>
            <input
              type="text"
              id="average"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="N/A"
              required
            />
          </div>
        </div>

        <div className="pt-8 mb-6 xl:ml xl:pt-12 ">
          <h1 className="text-md xl:text-xl font-bold  text-black">
            Departure from Nominal Value
          </h1>
        </div>

        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-5">
          {/* CDC */}
          <div>
            <label
              htmlFor="unit_cdc"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Unit Used for CDC:
            </label>
            <input
              type="text"
              id="unit_cdc"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Microliter"
              required
            />
          </div>
          {/* Normal Capacity */}
          <div>
            <label
              htmlFor="normal_capacity"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Normal Capacity (ml):
            </label>
            <input
              type="number"
              id="normal_capacity"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.1"
              required
            />
          </div>

          {/* Resolution */}
          <div>
            <label
              htmlFor="resolution_sub"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Resolution/Subdivision (ml):
            </label>
            <input
              type="number"
              id="resolution_sub"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00001"
              required
            />
          </div>

          {/* Number of Cycles */}

          <div>
            <label
              htmlFor="no_cycles"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Number of Cycles:
            </label>
            <input
              type="number"
              id="no_cycles"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="10"
              required
            />
          </div>

          {/* Calibration Point */}

          <div>
            <label
              htmlFor="calib_point"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Calibration Point:
            </label>
            <input
              type="number"
              id="calib_point"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="5"
              required
            />
          </div>
        </div>

        <div className="pt-8 mb-6 xl:ml xl:pt-12 ">
          <h1 className="text-md xl:text-xl font-bold  text-black">
            Balance Used
          </h1>
        </div>

        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-3">
          {/* Balance Used */}
          <div>
            <label
              htmlFor="balance_used"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Balance Used:
            </label>
            <input
              type="text"
              id="balance_used"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Balance 40G"
              required
            />
          </div>

          {/* ID No. */}
          <div>
            <label
              htmlFor="id_no"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              ID No:
            </label>
            <input
              type="text"
              id="id_no"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ST-WB6"
              required
            />
          </div>

          {/* Range (G) */}
          <div>
            <label
              htmlFor="range_no"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Rango (G):
            </label>
            <input
              type="text"
              id="range_no"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="40"
              required
            />
          </div>
        </div>

        {/* Calibration Data Header */}
        <div className="pt-8 mb-6 xl:ml xl:pt-12">
          <h1 className="text-md xl:text-xl font-bold text-black">
            Calibration Data
          </h1>
        </div>

        {/* Calibration Data Inputs */}
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Nominal Volume (mL)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Actual mL
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00001"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              T1 (°C)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="21.23"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              M1 (g)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              T2 (°C)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="21.23"
            />
          </div>
        </div>

        {/* Second Row of Calibration Data Inputs */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="2"
            />
          </div>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00002"
            />
          </div>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder=""
            />
          </div>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00500"
            />
          </div>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="21.23"
            />
          </div>
        </div>

        <div className="pt-8 mb-6 xl:ml xl:pt-12 ">
          <h1 className="text-md xl:text-xl font-bold  text-black">
            Mass Loss Per Cycle (Only for Piston Pipette)
          </h1>
        </div>

        <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-3">
          {/* First Column */}
          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            ></label>
          </div>
          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              YES
            </label>
          </div>
          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              NO
            </label>
          </div>

          {/* Second Column */}

          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              For test Volume uL
            </label>
          </div>

          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              118
            </label>
          </div>
          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              120
            </label>
          </div>

          {/* Third Column */}

          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Time to Complete 10 cycles (S)
            </label>
          </div>

          <div>
            <input
              type="number"
              id="time_complete"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.04981"
              required
            />
          </div>

          <div>
            <input
              type="number"
              id="time_complete_2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00000"
              required
            />
          </div>

          {/* Fourth Column */}

          <div>
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Mass loss per cycle (g)
            </label>
          </div>

          <div>
            <input
              type="number"
              id="mass_losscycle"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00003"
              required
            />
          </div>

          <div>
            <input
              type="number"
              id="mass_losscycle_2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="0.00000"
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

export default GlasswareInput;
