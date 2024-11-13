"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation in App Router
import Breadcrumb from "@/app/components/common/Breadcrumb";
import Image from "next/image";

import profPic from "../../../../public/assets/prof-pic.png";

const UserProfile = () => {
  const router = useRouter(); // Initialize the router

  // Function to handle button click
  const handleEditProfile = () => {
    router.push("profile/edit"); // Redirect to the edit profile page
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="container mx-auto py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-black">Profile</h1>
            <Breadcrumb
              titles={[
                { name: "Dashboard", href: "/dashboard" },
                { name: "Profile", href: "/dashboard/profile" },
              ]}
            />
          </div>
          <div className="flex flex-col items-center space-y-6">
            <Image
              src={profPic}
              alt="Profile Picture"
              width={160}
              height={160}
              className="rounded-full  cursor-pointer"
            />
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-black">Vince PCX</h2>
              <p className="text-red-600 text-xl">Technician</p>
            </div>

            <div className="mt-6 ">
              <h2 className="text-lg font-semibold text-black flex items-center justify-center">
                About Me
              </h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                condimentum metus tempus ut. Donec fermentum blandit aliquet.
              </p>
            </div>

            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Edit Profile button with redirect */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleEditProfile} // Attach the click handler here
              className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
