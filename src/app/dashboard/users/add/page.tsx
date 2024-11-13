"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/common/InputField";
import Button from "@/app/components/common/Button";
import TagInput from "@/app/components/common/TagInput"; // Adjust the import paths as needed
import { db } from "@/app/firebase/config"; // Adjust this path
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import User from "@/app/types/User";

const AddUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"information" | "role" | "skills">(
    "information"
  );

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
    skills: [],
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
    const { workerId, email, primaryPhone, skills } = newUser;

    if (!workerId || !email || !primaryPhone) {
      alert("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      await setDoc(doc(db, "users", workerId), {
        ...newUser,
        skills,
      });
      console.log("New user added with ID: ", workerId);

      await Swal.fire({
        title: "Success!",
        text: "User added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      router.push("users");
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("An error occurred while saving the user. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen min-w-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Add New User
      </h1>

      {/* Tabs */}
      <div className="flex border-b text-red-400">
        <button
          className={`py-2 px-4 ${
            activeTab === "information" ? "border-b-2 border-red-500" : ""
          }`}
          onClick={() => setActiveTab("information")}
        >
          Information
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "role" ? "border-b-2 border-red-500" : ""
          }`}
          onClick={() => setActiveTab("role")}
        >
          Role Giving
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "skills" ? "border-b-2 border-red-500" : ""
          }`}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "information" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Information Fields */}
            <InputField
              id="user-firstName"
              name="firstName"
              label="First Name"
              value={newUser.firstName}
              onChange={handleChange}
              required
            />
            <InputField
              id="user-middleName"
              name="middleName"
              label="Middle Name"
              value={newUser.middleName}
              onChange={handleChange}
            />
            <InputField
              id="user-lastName"
              name="lastName"
              label="Last Name"
              value={newUser.lastName}
              onChange={handleChange}
              required
            />
            <InputField
              id="user-email"
              name="email"
              label="Email"
              type="email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
            <InputField
              id="user-password"
              name="password"
              label="Password"
              type="password"
              value={newUser.password}
              onChange={handleChange}
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
              required
            />
            <InputField
              id="user-secondaryPhone"
              name="secondaryPhone"
              label="Secondary Phone"
              value={newUser.secondaryPhone}
              onChange={handleChange}
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
          </div>
        )}

        {activeTab === "role" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role Giving Fields */}
            <InputField
              id="user-workerId"
              name="workerId"
              label="Worker ID"
              value={newUser.workerId}
              onChange={handleChange}
              required
            />
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
            />
            <InputField
              id="user-stateProvince"
              name="stateProvince"
              label="State/Province"
              value={newUser.stateProvince}
              onChange={handleChange}
            />
            <InputField
              id="user-zipCode"
              name="zipCode"
              label="Zip Code"
              value={newUser.zipCode}
              onChange={handleChange}
            />
            <InputField
              id="user-emergencyContactName"
              name="emergencyContactName"
              label="Emergency Contact Name"
              value={newUser.emergencyContactName}
              onChange={handleChange}
            />
            <InputField
              id="user-emergencyContactPhone"
              name="emergencyContactPhone"
              label="Emergency Contact Phone"
              value={newUser.emergencyContactPhone}
              onChange={handleChange}
            />
            <InputField
              id="user-emergencyRelationship"
              name="emergencyRelationship"
              label="Emergency Relationship"
              value={newUser.emergencyRelationship}
              onChange={handleChange}
            />
          </div>
        )}

        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills Fields */}
            <InputField
              id="user-profilePicture"
              name="profilePicture"
              label="Profile Picture URL"
              value={newUser.profilePicture}
              onChange={handleChange}
            />
            <InputField
              id="user-shortBio"
              name="shortBio"
              label="Short Bio"
              value={newUser.shortBio}
              onChange={handleChange}
            />
            <TagInput
              id="user-skills"
              name="skills"
              label="Skills"
              skills={newUser.skills}
              onSkillsChange={(skills) => setNewUser({ ...newUser, skills })}
              placeholder={"Skills"}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" label="Save" onClick={handleSave} />
      </div>
    </div>
  );
};

export default AddUser;
