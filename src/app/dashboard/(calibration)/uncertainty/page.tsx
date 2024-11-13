import Breadcrumb from "@/app/components/common/Breadcrumb";
import UncertaintyInput from "@/app/components/CalibrationData/UncertaintyInput";
import React from "react";

const UncertaintyCalibration = () => {
  return (
    <div className="bg-white">
      <Breadcrumb
        titles={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Calibration", href: "/dashboard/uncertainty" },
          { name: "Uncertainty Calibration (Volumetric Glassware)" },
        ]}
      />
      <main className="bg-gray-50 min-h-screen xl:px-4">
        <div className="ml-4 pt-8 xl:ml-4 xl:pt-12 ">
          <h1 className="text-md xl:text-3xl font-bold text-black">
            Uncertainty Calibration (Volumetric Glassware)
          </h1>

          <UncertaintyInput />
        </div>
      </main>
    </div>
  );
};

export default UncertaintyCalibration;
