/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { db, auth } from "@/app/firebase/config"; // Adjust this path
import { doc, updateDoc } from "firebase/firestore";
import DisabledField from "../common/DisabledField";
import TagInput from "../common/TagInput";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";

import Swal from "sweetalert2";
import { FirebaseError } from "firebase/app";

interface User {
  id: string;
  uid: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string; // Add this if you're managing passwords
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

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        skills: Array.isArray(user.skills) ? user.skills : [],
      });
    }
  }, [user]);

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => (prev ? { ...prev, skills } : null));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
          }
        : null
    );
  };

  const handleEmailChange = async (newEmail: string) => {
    const user = auth.currentUser; // Get the current user

    if (user) {
      try {
        // Send verification email
        await sendEmailVerification(user);
        console.log(`Verification email sent to ${newEmail}.`);

        // Optionally, show a message to the user
        Swal.fire({
          title: "Verification Email Sent!",
          text: `Please verify your new email address: ${newEmail}.`,
          icon: "info",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error sending verification email:", error);

        // Use type assertion to specify the error type
        const errorMessage =
          (error as Error).message || "An error occurred. Please try again.";

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      console.error("No user is logged in.");
      Swal.fire({
        title: "Error!",
        text: "No user is logged in.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData) {
      const { email } = formData;

      if (!currentPassword) {
        Swal.fire("Error!", "Please enter your current password.", "error");
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        Swal.fire("Error!", "User not authenticated.", "error");
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );

      try {
        // Reauthenticate the user
        await reauthenticateWithCredential(user, credential);

        // Update email if it's different from the current one
        if (email && email !== user.email) {
          await updateEmail(user, email);
          // Send email verification
          await sendEmailVerification(user);
          Swal.fire(
            "Success!",
            "A verification email has been sent. Please verify your new email.",
            "success"
          );
        }

        // Update password if a new password is provided
        if (newPassword) {
          await updatePassword(user, newPassword);
          Swal.fire("Success!", "Password has been updated.", "success");
        }

        // Update Firestore user document
        const userRef = doc(db, "users", formData.workerId);
        await updateDoc(userRef, { ...formData });

        onSave(formData);
        router.push("/dashboard/users");
        Swal.fire("Saved!", "Your changes have been saved.", "success");
      } catch (error) {
        console.error("Error updating user: ", error);

        const firebaseError = error as FirebaseError;

        if (firebaseError.code) {
          switch (firebaseError.code) {
            case "auth/wrong-password":
              Swal.fire("Error!", "Incorrect current password.", "error");
              break;
            case "auth/user-not-found":
              Swal.fire("Error!", "No user found with this email.", "error");
              break;
            case "auth/operation-not-allowed":
              Swal.fire(
                "Error!",
                "Operation not allowed. Please verify your new email.",
                "error"
              );
              break;
            default:
              Swal.fire(
                "Error!",
                "There was a problem saving your changes: " +
                  firebaseError.message,
                "error"
              );
          }
        } else {
          Swal.fire("Error!", "An unknown error occurred.", "error");
        }
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white p-6 w-full max-w-4xl rounded-lg shadow-lg z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2" onClick={onClose}>
          <svg
            className="w-6 h-6 text-gray-600 hover:text-gray-800 transition"
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

        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Edit User</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-auto"
        >
          {/* Form Fields */}
          <DisabledField
            id="user-workerId"
            label="Worker ID"
            value={formData?.workerId || ""}
            placeholder="Enter Worker ID"
          />
          <InputField
            id="user-firstName"
            name="firstName"
            label="First Name"
            value={formData?.firstName || ""}
            onChange={handleChange}
            placeholder="Enter First Name"
            required
          />
          <InputField
            id="user-middleName"
            name="middleName"
            label="Middle Name"
            value={formData?.middleName || ""}
            onChange={handleChange}
            placeholder="Enter Middle Name"
          />
          <InputField
            id="user-lastName"
            name="lastName"
            label="Last Name"
            value={formData?.lastName || ""}
            onChange={handleChange}
            placeholder="Enter Last Name"
            required
          />
          <InputField
            id="user-email"
            name="email"
            label="Email"
            type="email"
            value={formData?.email || ""}
            onChange={handleChange}
            placeholder="Enter User Email"
            required
          />
          <InputField
            id="currentPassword"
            name="currentPassword"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
          <InputField
            id="newPassword"
            name="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (optional)"
          />
          <div>
            <label htmlFor="user-gender" className="block text-gray-700">
              Gender
            </label>
            <select
              id="user-gender"
              name="gender"
              value={formData?.gender || ""}
              onChange={handleChange}
              className="block w-full mt-2 border border-gray-300 rounded-md p-2"
              required
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
            value={formData?.dateOfBirth || ""}
            onChange={handleChange}
            required
          />
          <InputField
            id="user-primaryPhone"
            name="primaryPhone"
            label="Primary Phone"
            value={formData?.primaryPhone || ""}
            onChange={handleChange}
            placeholder="Enter Primary Phone"
            required
          />
          <InputField
            id="user-secondaryPhone"
            name="secondaryPhone"
            label="Secondary Phone"
            value={formData?.secondaryPhone || ""}
            onChange={handleChange}
            placeholder="Enter Secondary Phone"
          />
          <InputField
            id="user-streetAddress"
            name="streetAddress"
            label="Street Address"
            value={formData?.streetAddress || ""}
            onChange={handleChange}
            placeholder="Enter Street Address"
          />
          <InputField
            id="user-stateProvince"
            name="stateProvince"
            label="State/Province"
            value={formData?.stateProvince || ""}
            onChange={handleChange}
            placeholder="Enter State/Province"
          />
          <InputField
            id="user-zipCode"
            name="zipCode"
            label="Zip Code"
            value={formData?.zipCode || ""}
            onChange={handleChange}
            placeholder="Enter Zip Code"
          />
          <InputField
            id="user-emergencyContactName"
            name="emergencyContactName"
            label="Emergency Contact Name"
            value={formData?.emergencyContactName || ""}
            onChange={handleChange}
            placeholder="Enter Emergency Contact Name"
          />
          <InputField
            id="user-emergencyContactPhone"
            name="emergencyContactPhone"
            label="Emergency Contact Phone"
            value={formData?.emergencyContactPhone || ""}
            onChange={handleChange}
            placeholder="Enter Emergency Contact Phone"
          />
          <InputField
            id="user-emergencyRelationship"
            name="emergencyRelationship"
            label="Emergency Relationship"
            value={formData?.emergencyRelationship || ""}
            onChange={handleChange}
            placeholder="Enter Emergency Relationship"
          />
          <InputField
            id="user-shortBio"
            name="shortBio"
            label="Short Bio"
            value={formData?.shortBio || ""}
            onChange={handleChange}
            placeholder="Enter Short Bio"
          />
          {/* Replace the InputField for skills with TagInput */}
          <div>
            <label htmlFor="user-skills" className="block text-gray-700">
              Skills
            </label>
            <TagInput
              id="user-skills"
              name="skills"
              skills={formData?.skills || []} // Current skills array
              onSkillsChange={handleSkillsChange} // Function to handle changes
              placeholder="Add skills" // Placeholder text
              label={""}
            />
          </div>
          <InputField
            id="user-primaryCode"
            name="primaryCode"
            label="Primary Code"
            value={formData?.primaryCode || ""}
            onChange={handleChange}
            placeholder="Enter Primary Code"
          />
          <InputField
            id="user-secondaryCode"
            name="secondaryCode"
            label="Secondary Code"
            value={formData?.secondaryCode || ""}
            onChange={handleChange}
            placeholder="Enter Secondary Code"
          />
          <InputField
            id="user-expirationDate"
            name="expirationDate"
            label="Expiration Date"
            type="date"
            value={formData?.expirationDate || ""}
            onChange={handleChange}
          />

          <div></div>

          <div></div>
          <div className="flex justify-end mt-6 gap-2">
            <Button type="submit" label="Save" />
            <Button type="button" label="Cancel" onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
