// ViewUserModal.tsx
import React from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
  streetAddress: string;
  gender: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  skills: string[];
}

interface ViewUserModalProps {
  user: User; // Ensure user is correctly typed
  onClose: () => void;
  isOpen: boolean;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  user,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-black">{`${user.firstName} ${user.lastName}`}</h2>
        <p className="text-gray-600">Email: {user.email}</p>
        <p className="text-gray-600">Phone: {user.primaryPhone}</p>
        <p className="text-gray-600">Address: {user.streetAddress}</p>
        <p className="text-gray-600">Gender: {user.gender}</p>
        <p className="text-gray-600">DOB: {user.dateOfBirth}</p>
        <p className="text-gray-600">
          Emergency Contact: {user.emergencyContactName}
        </p>
        <p className="text-gray-600">
          Emergency Phone: {user.emergencyContactPhone}
        </p>
        <p className="text-gray-600">Skills: {user.skills.join(", ")}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
