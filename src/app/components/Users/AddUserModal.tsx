import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { db, auth } from "@/app/firebase/config"; // Adjust this path
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import auth function
import Swal from "sweetalert2";
import User from "@/app/types/User";
import TagInput from "../common/TagInput"; // Adjust this import path

const AddUser: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [newUser, setNewUser] = useState<User>({
    workerId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    primaryPhone: "",
    secondaryPhone: "",
    activePhone1: false,
    activePhone2: false,
    activeUser: false,
    isAdmin: false,
    isFieldWorker: false,
    streetAddress: "",
    stateProvince: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyRelationship: "",
    profilePicture: "",
    shortBio: "",
    skills: [], // Change to an array
    primaryCode: "",
    secondaryCode: "",
    expirationDate: "",
    timestamp: new Date(),
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const isCheckbox = type === "checkbox";

    setNewUser({
      ...newUser,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSave = async () => {
    const { workerId, email, password, primaryPhone, skills } = newUser;

    // Simple validation
    if (!workerId || !email || !primaryPhone || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      // Add new user to Firestore with workerId as document ID
      await setDoc(doc(db, "users", workerId), {
        ...newUser,
        skills, // Store skills as an array in Firestore
        uid, // Store the Authentication UID for reference
      });

      console.log("New user added with ID: ", workerId);

      // Show SweetAlert on success
      await Swal.fire({
        title: "Success!",
        text: "User added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      router.push("/dashboard/users");
      onClose(); // Close modal after saving
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("An error occurred while saving the user. Please try again.");
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          {/* Modal */}
          <div
            className="bg-white p-6 w-2/3 max-w-3xl rounded-lg shadow-lg z-50 overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            <button className="absolute top-2 right-2" onClick={onClose}>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Add New User
            </h1>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <InputField
                id="user-workerId"
                name="workerId"
                label="Worker ID"
                value={newUser.workerId}
                onChange={handleChange}
                placeholder="Enter Worker ID"
                required
              />
              <InputField
                id="user-firstName"
                name="firstName"
                label="First Name"
                value={newUser.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
              />
              <InputField
                id="user-middleName"
                name="middleName"
                label="Middle Name"
                value={newUser.middleName}
                onChange={handleChange}
                placeholder="Enter Middle Name"
              />
              <InputField
                id="user-lastName"
                name="lastName"
                label="Last Name"
                value={newUser.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
              />
              <InputField
                id="user-email"
                name="email"
                label="Email"
                type="email"
                value={newUser.email}
                onChange={handleChange}
                placeholder="Enter User Email"
                required
              />
              <InputField
                id="user-password"
                name="password"
                label="Password"
                type="password"
                value={newUser.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
              <div>
                <label
                  htmlFor="user-gender"
                  className="block font-bold text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="user-gender"
                  name="gender"
                  value={newUser.gender}
                  onChange={handleChange}
                  className="block w-full mt-2 border border-gray-300 rounded-md p-2 text-black"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <InputField
                id="user-dateOfBirth"
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={newUser.dateOfBirth}
                onChange={handleChange}
              />
              <InputField
                id="user-primaryPhone"
                name="primaryPhone"
                label="Primary Phone"
                value={newUser.primaryPhone}
                onChange={handleChange}
                placeholder="Enter Primary Phone"
                required
              />
              <InputField
                id="user-secondaryPhone"
                name="secondaryPhone"
                label="Secondary Phone"
                value={newUser.secondaryPhone}
                onChange={handleChange}
                placeholder="Enter Secondary Phone"
              />
              <div className="text-black">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="user-activePhone1"
                    name="activePhone1"
                    checked={newUser.activePhone1}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="user-activePhone1">Active Phone 1</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="user-activePhone2"
                    name="activePhone2"
                    checked={newUser.activePhone2}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="user-activePhone2">Active Phone 2</label>
                </div>
              </div>
              <div className="text-black">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="user-activeUser"
                    name="activeUser"
                    checked={newUser.activeUser}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="user-activeUser">Active User</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="user-isAdmin"
                    name="isAdmin"
                    checked={newUser.isAdmin}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="user-isAdmin">Is Admin</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="user-isFieldWorker"
                    name="isFieldWorker"
                    checked={newUser.isFieldWorker}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="user-isFieldWorker">Is Field Worker</label>
                </div>
              </div>
              <InputField
                id="user-streetAddress"
                name="streetAddress"
                label="Street Address"
                value={newUser.streetAddress}
                onChange={handleChange}
                placeholder="Enter Street Address"
              />
              <InputField
                id="user-stateProvince"
                name="stateProvince"
                label="State/Province"
                value={newUser.stateProvince}
                onChange={handleChange}
                placeholder="Enter State/Province"
              />
              <InputField
                id="user-zipCode"
                name="zipCode"
                label="Zip Code"
                value={newUser.zipCode}
                onChange={handleChange}
                placeholder="Enter Zip Code"
              />
              <InputField
                id="user-emergencyContactName"
                name="emergencyContactName"
                label="Emergency Contact Name"
                value={newUser.emergencyContactName}
                onChange={handleChange}
                placeholder="Enter Emergency Contact Name"
              />
              <InputField
                id="user-emergencyContactPhone"
                name="emergencyContactPhone"
                label="Emergency Contact Phone"
                value={newUser.emergencyContactPhone}
                onChange={handleChange}
                placeholder="Enter Emergency Contact Phone"
              />
              <InputField
                id="user-emergencyRelationship"
                name="emergencyRelationship"
                label="Emergency Relationship"
                value={newUser.emergencyRelationship}
                onChange={handleChange}
                placeholder="Enter Emergency Relationship"
              />
              <InputField
                id="user-profilePicture"
                name="profilePicture"
                label="Profile Picture URL"
                value={newUser.profilePicture}
                onChange={handleChange}
                placeholder="Enter Profile Picture URL"
              />
              <InputField
                id="user-shortBio"
                name="shortBio"
                label="Short Bio"
                value={newUser.shortBio}
                onChange={handleChange}
                placeholder="Enter Short Bio"
              />
              {/* Tag Input for Skills */}
              <TagInput
                id="user-skills"
                name="skills"
                label="Skills"
                skills={newUser.skills} // Pass skills array
                onSkillsChange={(newSkills) =>
                  setNewUser({ ...newUser, skills: newSkills })
                } // Update the skills array
                placeholder="Add skills and press Enter"
              />

              <InputField
                id="user-primaryCode"
                name="primaryCode"
                label="Primary Code"
                value={newUser.primaryCode}
                onChange={handleChange}
                placeholder="Enter Primary Code"
              />
              <InputField
                id="user-secondaryCode"
                name="secondaryCode"
                label="Secondary Code"
                value={newUser.secondaryCode}
                onChange={handleChange}
                placeholder="Enter Secondary Code"
              />
              <InputField
                id="user-expirationDate"
                name="expirationDate"
                label="Expiration Date"
                type="date"
                value={newUser.expirationDate}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" label="Save" onClick={handleSave} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
