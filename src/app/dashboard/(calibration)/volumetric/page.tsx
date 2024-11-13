import React from "react";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import Inputform from "@/app/components/CalibrationData/Inputform";

const CalibrationVolumetric = () => {
  const breadcrumbTitles = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Calibration", href: "/dashboard/calibration" },
    { name: "Calibration Data (Volumetric)" },
  ];

  return (
    <div className="bg-white h-screen">
      <Breadcrumb titles={breadcrumbTitles} />
      <main className="bg-gray-50 min-h-screen xl:px-4">
        <div className="ml-4 pt-8 xl:ml-4 xl:pt-12">
          <h1 className="text-md xl:text-5xl font-bold text-black">
            Calibration Data (Volumetric)
          </h1>

          <p className="text-gray-500 xl:ml-2 xl:my-2">
            Please fill in the calibration data form below
          </p>
          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
          <Inputform />
        </div>
      </main>
    </div>
  );
};

export default CalibrationVolumetric;
