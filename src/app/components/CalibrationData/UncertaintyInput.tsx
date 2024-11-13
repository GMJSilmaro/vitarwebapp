import React from "react";

const UncertaintyInput = () => {
  return (
    <div className="mt-8 px-4">
      {/* First Section: Certificate, Software Version, Source Version */}
      <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-3">
        <div className="w-full">
          <label
            htmlFor="certificate_No"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Certificate No.
          </label>
          <input
            type="text"
            id="certificate_No"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            placeholder="ex.1001-250"
            disabled
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="software_version"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Software Version
          </label>
          <input
            type="text"
            id="software_version"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            placeholder="ex.1.2.0"
            disabled
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="source_version"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Source Version
          </label>
          <input
            type="text"
            id="source_version"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            placeholder="ex.1.0"
            disabled
          />
        </div>
      </div>

      {/* Second Section: Calibration Data */}
      <div className="ml-4 pt-8 xl:ml-4 xl:pt-12">
        <h1 className="text-md xl:text-3xl font-bold text-black">
          Calibration Data
        </h1>

        {/* Grid for Calibration Data with labels and inputs */}
        <div className="grid gap-4 mb-6 mt-8 grid-cols-1 md:grid-cols-7">
          <div>
            <label
              htmlFor="point"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Point
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. A1"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="normal_value"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Normal Value
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. 1001-250"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="volume_at"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Volume at 20°C (ML)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. 1001-250"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="correction"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Correction (ML)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. 1001-250"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="mpe"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              MPE (ML)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. 1001-250"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="expand_unc"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Expanded Uncertainty (ML)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. 100
                              1-250"
              disabled
            />{" "}
          </div>

          <div>
            <label
              htmlFor="val_k"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              K
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="ex. 2"
              disabled
            />
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-red-300 p-4 md:p-16 rounded-xl border border-gray-950 text-red-800 text-sm md:text-base">
          <p className="text-left">Note:</p>
          <p className="text-left">MPE with reference to ISO 8665-2-2022</p>
          <p className="text-left">MPE - Maximum Permissible Error</p>
          <p className="text-left">* Exceeds MPE value.</p>
          <p className="text-left italic">
            User should determine the suitability of the volumetric instrument
            for its intended use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UncertaintyInput;
