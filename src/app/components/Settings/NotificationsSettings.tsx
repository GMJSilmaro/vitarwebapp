"use client";

const Notifications: React.FC = () => {
  return (
    <form className="space-y-6 text-gray-900">
      <label className="flex items-center">
        <input type="checkbox" className="form-checkbox" />
        <span className="ml-2">Email Notifications</span>
      </label>
      <label className="flex items-center">
        <input type="checkbox" className="form-checkbox" />
        <span className="ml-2">SMS Notifications</span>
      </label>
    </form>
  );
};

export default Notifications;
