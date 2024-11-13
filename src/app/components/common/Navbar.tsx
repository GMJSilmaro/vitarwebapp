"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import profilePic from "../../../../public/assets/prof-pic.png"; // Replace with the path to your profile picture
import Link from "next/link";
import { auth } from "@/app/firebase/config"; // Import your Firebase configuration
import { signOut } from "firebase/auth"; // Import the signOut function
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Swal from "sweetalert2"; // Import SweetAlert2

const Navbar: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
  const router = useRouter(); // Initialize the router

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  // Close the dropdown if the user clicks outside
  const handleClickOutside = (e: MouseEvent) => {
    // Check if the clicked element is outside the dropdown and profile image
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to close the dropdown menu
  const closeDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Logout function with SweetAlert confirmation
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth); // Sign out from Firebase
        router.push("/login"); // Redirect to login page
      } catch (error) {
        console.error("Error logging out:", error); // Log any errors
      }
    }
  };

  return (
    <nav className="bg-red-500 p-4 justify-end items-center hidden lg:flex relative">
      {/* Profile Picture */}
      <div className="relative text-black">
        <Image
          src={profilePic}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
          onClick={toggleProfileDropdown}
        />

        {/* Dropdown Menu */}
        {isProfileDropdownOpen && (
          <div
            ref={dropdownRef} // Attach the ref to the dropdown
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg"
          >
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link
                  href="/dashboard/settings"
                  className="block"
                  onClick={closeDropdown}
                >
                  Profile Settings
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <button
                  onClick={() => {
                    handleLogout(); // Call the logout function
                    closeDropdown(); // Close the dropdown
                  }}
                  className="block w-full text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
