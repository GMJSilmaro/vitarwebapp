"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/app/firebase/config"; // Adjust the path for your config
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import CalibrationCards from "../components/CalibrationCards/page";
import ListPagination from "../components/ListPagination/page";

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          // Query Firestore to check if the user exists based on their email
          const usersRef = collection(db, "users"); // Adjust 'users' to your collection name
          const q = query(usersRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Assuming there's only one user document for the email
            const userDoc = querySnapshot.docs[0].data();
            setUserName(userDoc.firstName || user.displayName || user.email); // Fallback to displayName or email
          } else {
            setUserName(user.displayName || user.email); // If user not found in Firestore, fallback to auth info
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore: ", error);
          setUserName(user.displayName || user.email); // Fallback in case of an error
        }
      }
      setLoading(false); // Done with the loading state
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: show a loading indicator while checking auth state
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="px-12 py-8">
        <h1 className="text-2xl font-bold text-black">
          {userName ? `Welcome Back, ${userName}!` : "Welcome Back!"}
        </h1>
        <p className="text-gray-500">
          Stay on top of your calibration management tasks with the latest
          updates below. Click on a section for detailed insights to ensure all
          equipment is compliant and performing at its best.
        </p>
      </div>

      <div>
        <CalibrationCards />
      </div>

      <div className="mt-6">
        <ListPagination />
      </div>
    </main>
  );
};

export default Dashboard;
