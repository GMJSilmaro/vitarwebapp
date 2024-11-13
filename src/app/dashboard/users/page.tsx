"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
// import { signOut } from "firebase/auth";
import { db } from "@/app/firebase/config";
import AddUser from "@/app/components/Users/AddUserModal";
import EditUserModal from "@/app/components/Users/EditUserModal";
import ViewUserModal from "@/app/components/Users/ViewUserModal"; // Import the ViewUserModal
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";

interface User {
  id: string;
  uid: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  primaryPhone: string;
  secondaryPhone: string;
  activePhone1: string;
  activePhone2: string;
  activeUser: boolean;
  isAdmin: boolean;
  isFieldWorker: boolean;
  workerId: string;
  streetAddress: string;
  stateProvince: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  profilePicture?: string;
  shortBio: string;
  skills: string[];
  primaryCode: string;
  secondaryCode: string;
  expirationDate: string;
  timestamp: string;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for the ViewUserModal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const fetchedUsers = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (workerId: string) => {
    const userToEdit = users.find((user) => user.workerId === workerId) || null;
    setSelectedUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const handleView = (workerId: string) => {
    const userToView = users.find((user) => user.workerId === workerId) || null;
    setSelectedUser(userToView);
    setIsViewModalOpen(true); // Open the ViewUserModal
  };

  const handleDelete = (workerId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.workerId !== workerId)
      );
    }
  };

  const handleSave = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Logged Out",
  //       text: "You have been successfully logged out.",
  //       confirmButtonColor: "#3085d6",
  //       confirmButtonText: "OK",
  //     }).then(() => {
  //       router.push("/login"); // Redirect to login page
  //     });
  //   } catch (error) {
  //     console.error("Error logging out: ", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to log out. Please try again.",
  //     });
  //   }
  // };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" ||
      (selectedRole === "Admin" && user.isAdmin) ||
      (selectedRole === "Field Worker" && user.isFieldWorker);

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 lg:p-12 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Users</h1>
        {/* <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button> */}
      </div>
      {/* Search, Filter, and Add Button */}
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex flex-col lg:flex-row gap-4 mb-4 lg:mb-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
          <select
            value={selectedRole}
            onChange={handleRoleFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Field Worker">Field Worker</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Add User
        </button>
      </div>

      {/* User List and Tables */}
      <div className="block lg:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 mb-4 bg-white shadow"
            >
              <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Phone: {user.primaryPhone}</p>
              <p className="text-gray-600">Address: {user.streetAddress}</p>
              <p className="text-gray-600">
                Role: {user.isAdmin ? "Admin" : "Field Worker"}
              </p>
              <p className="text-gray-600">Gender: {user.gender}</p>
              <p className="text-gray-600">DOB: {user.dateOfBirth}</p>
              <p className="text-gray-600">
                Emergency Contact: {user.emergencyContactName}
              </p>
              <button
                onClick={() => handleEdit(user.id)}
                className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleView(user.workerId)} // Add this button
                className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No users found</div>
        )}
      </div>

      {/* Larger Screens Table */}
      <div className="hidden lg:block overflow-x-auto h-screen">
        <table className="w-full text-sm text-left text-gray-600 bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {/* Table Headers */}
              <th className="px-6 py-3">Worker ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="bg-white border-b">
                <td className="px-6 py-4"> {user.workerId}</td>
                <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.isAdmin ? "Admin" : "Field Worker"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(user.workerId)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.workerId)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleView(user.workerId)} // Add this button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddUser onClose={() => setIsModalOpen(false)} isOpen={true} />
      )}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          isOpen={true}
        />
      )}
      {isViewModalOpen && selectedUser && (
        <ViewUserModal
          user={selectedUser} // Pass the selected user
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersPage;
