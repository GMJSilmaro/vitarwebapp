/* eslint-disable react/no-unescaped-entities */
import React from "react";

const ListPagination: React.FC = () => {
  return (
    <div className="overflow-x-auto shadow-md rounded-xl xl:mx-24 xl:py-4 p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-300">
          <caption className="p-4 text-lg font-semibold text-left rtl:text-right text-gray-800 bg-gray-200">
            Latest Calibrations
          </caption>
          <thead className="hidden sm:table-header-group text-xs text-black uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Calibration ID
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Equipment Name
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Date
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Technician
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Next Due
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Status
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Table row for larger screens */}
            <tr className="hidden sm:table-row bg-white border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 sm:px-6 sm:py-4 font-medium whitespace-nowrap text-black"
              >
                #CAL-1234
              </th>
              <td className="px-4 py-2 sm:px-6 sm:py-4 text-black">
                Pressure Gauge
              </td>
              <td className="px-4 py-2 sm:px-6 sm:py-4 text-gray-400">
                24th June, 2024
              </td>
              <td className="px-4 py-2 sm:px-6 sm:py-4 text-black">John Doe</td>
              <td className="px-4 py-2 sm:px-6 sm:py-4 text-gray-400">
                24th June, 2024
              </td>
              <td className="px-4 py-2 sm:px-6 sm:py-4 text-black">
                <span className="rounded-lg bg-green-300 p-1">Completed</span>
              </td>
              <td className="px-4 py-2 sm:px-6 sm:py-4 text-right">
                <a
                  href="#"
                  className="font-medium text-blue-500 dark:text-blue-400 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>

            {/* Mobile-friendly view */}
            <tr className="sm:hidden bg-white border-b dark:border-gray-700">
              <td className="px-4 py-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium text-black">#CAL-1234</div>
                  <div className="text-gray-600">Pressure Gauge</div>
                  <div className="text-gray-400">24th June, 2024</div>
                  <div className="text-black">John Doe</div>
                  <div className="text-gray-400">Next Due: 24th June, 2024</div>
                  <div>
                    <span className="inline-block bg-green-300 rounded-lg p-1">
                      Completed
                    </span>
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-500 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPagination;
