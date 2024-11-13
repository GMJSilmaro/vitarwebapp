import Breadcrumb from "@/app/components/common/Breadcrumb";
import GlasswareInput from "@/app/components/CalibrationData/GlasswareInput";
import React from "react";

const VolumetricGlassware = () => {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        titles={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Calibration", href: "/dashboard/calibration" },
          { name: "Calibration Data (Volumetric Glassware)" },
        ]}
      />
      <main className="bg-gray-50 min-h-screen xl:px-4">
        <div className="ml-4 pt-8 xl:ml-4 xl:pt-12 ">
          <h1 className="text-md xl:text-4xl font-bold text-black">
            Calibration Data (Volumetric Glassware)
          </h1>

          <p className="text-gray-500 xl:ml-2 xl:my-2">
            Please fill in the calibration data form below
          </p>
          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        </div>
        <GlasswareInput />
      </main>
    </div>
  );
};

export default VolumetricGlassware;
