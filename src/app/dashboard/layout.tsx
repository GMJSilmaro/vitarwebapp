"use client";

import { useEffect } from "react";
import { auth } from "@/app/firebase/config"; // Ensure the path is correct
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.email);
      } else {
        console.log("No user is logged in.");
        router.push("/login"); // Redirect to the login page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Log every time the children (current page) change
  useEffect(() => {
    console.log("Navigated to a page in the dashboard.");
  }, [children]); // This will trigger on every children change

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="xl:ml-64">
        {/* Navbar */}
        <Navbar />
        {/* Main Page Content */}
        <main className="bg-white p-12 xl:p-0">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
