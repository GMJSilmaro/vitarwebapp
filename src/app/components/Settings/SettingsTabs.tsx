"use client";

import { useState } from "react";

interface Tab {
  label: string;
  key: string;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (key: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;
    setSelectedTab(selectedKey);
    onTabClick(selectedKey);
  };

  return (
    <div className="mb-4">
      {/* Dropdown for mobile view */}
      <select
        value={selectedTab}
        onChange={handleChange}
        className="block w-full mb-4 text-gray-600 border border-gray-300 rounded-lg sm:hidden"
      >
        {tabs.map((tab) => (
          <option key={tab.key} value={tab.key}>
            {tab.label}
          </option>
        ))}
      </select>

      {/* Tab Navigation for larger screens */}
      <div className="hidden sm:flex space-x-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setSelectedTab(tab.key);
              onTabClick(tab.key);
            }}
            className={`pb-2 px-4 ${
              activeTab === tab.key
                ? "border-b-2 border-red-600 text-red-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsTabs;
