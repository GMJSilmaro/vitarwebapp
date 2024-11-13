// app/dashboard/CalibrationCards.tsx
import React from "react";

const CalibrationCards: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:mx-16">
      <div className="grid grid-cols-2 gap-4  md:grid-cols-2 lg:grid-cols-2">
        {/* Card 1 */}
        <div className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h1 className="mb-1 text-base sm:text-lg font-bold tracking-tight text-gray-900">
            Total Calibrations Completed
          </h1>
          <h2 className="mb-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            125
          </h2>
          <p className="text-sm sm:text-base font-normal text-green-500">
            + 5.2%
          </p>
        </div>

        {/* Card 2 */}
        <div className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h1 className="mb-1 text-base sm:text-lg font-bold tracking-tight text-gray-900">
            Equipment Pending Calibration
          </h1>
          <h2 className="mb-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            45
          </h2>
          <p className="text-sm sm:text-base font-normal text-red-500">
            - 2.3%
          </p>
        </div>

        {/* Card 3 */}
        <div className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h1 className="mb-1 text-base sm:text-lg font-bold tracking-tight text-gray-900">
            Upcoming Calibration Schedules
          </h1>
          <h2 className="mb-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            30
          </h2>
          <p className="text-sm sm:text-base font-normal text-blue-500">
            + 1.5%
          </p>
        </div>

        {/* Card 4 */}
        <div className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h1 className="mb-1 text-base sm:text-lg font-bold tracking-tight text-gray-900">
            Equipment Out of Service
          </h1>
          <h2 className="mb-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            10
          </h2>
          <p className="text-sm sm:text-base font-normal text-yellow-500">
            - 0.8%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalibrationCards;
