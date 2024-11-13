"use client";

import { useState } from "react";
import SettingsTabs from "../../components/Settings/SettingsTabs";
import AccountInfo from "../../components/Settings/AccountInfo";
import ChangePassword from "../../components/Settings/ChangePassword";
import Notifications from "../../components/Settings/NotificationsSettings";
import DeactivateAccount from "../../components/Settings/DeactivateAccount";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("account");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "account":
        return <AccountInfo />;
      case "password":
        return <ChangePassword />;
      case "notifications":
        return <Notifications />;
      case "deactivate":
        return <DeactivateAccount />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="p-6 lg:p-12 bg-white min-h-screen">
      <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 lg:mb-8">
        Account Settings
      </h1>

      {/* Tab Navigation */}
      <SettingsTabs
        tabs={[
          { label: "Account Info", key: "account" },
          { label: "Change Password", key: "password" },
          { label: "Notifications", key: "notifications" },
          { label: "Deactivate Account", key: "deactivate" },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      {/* Render the active tab content */}
      <div className="mt-4 lg:mt-8">{renderActiveTab()}</div>
    </div>
  );
};

export default SettingsPage;
