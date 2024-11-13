/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Image from "next/image";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Swal from "sweetalert2"; // Import SweetAlert

import { auth, db } from "@/app/firebase/config"; // Make sure the path is correct
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore imports

export default function Login() {
  const [loginInput, setLoginInput] = useState(""); // Input for email or workerID
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  // Function to determine if the input is an email
  const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);

  // Handle form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      let email = loginInput;

      // If the input is not an email, treat it as a workerID and look up the email in Firestore
      if (!isEmail(loginInput)) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("workerId", "==", loginInput)); // Check workerID in Firestore
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // If no user is found with the given workerID
          throw new Error("No user found with the provided Worker ID.");
        }

        // Assuming each workerID is unique, grab the first document found
        querySnapshot.forEach((doc) => {
          email = doc.data().email; // Use the email found in Firestore
        });
      }

      // Try signing in with the email (either entered or retrieved from Firestore)
      const userCredential = await signInWithEmailAndPassword(email, password);

      // Store user session or redirect after successful login
      if (userCredential) {
        sessionStorage.setItem("LoggedIn", "true"); // Use JSON.stringify
        console.log("User logged in:", email);

        // Show SweetAlert confirmation
        Swal.fire({
          title: "Logged in Successfully!",
          text: `Welcome, ${email}!`,
          icon: "success",
          confirmButtonText: "Go to Users",
        }).then(() => {
          // After closing the alert, navigate to the users page
          router.push("/dashboard/users");
        });
      }
    } catch (err) {
      console.error(err);

      // Set a generic error message
      let errorMessage = "An error occurred. Please try again.";

      // Check if the error is a FirebaseError or general Error
      if (err instanceof Error) {
        // Check for specific Firebase errors and customize the message
        if (err.message.includes("auth/invalid-credential")) {
          errorMessage =
            "Invalid credentials. Please check your email or password.";
        } else if (err.message.includes("auth/user-not-found")) {
          errorMessage = "No user found with this email or Worker ID.";
        } else if (err.message.includes("auth/wrong-password")) {
          errorMessage = "Incorrect password. Please try again.";
        }
      }

      // Handle error (e.g., show a message to the user)
      Swal.fire({
        title: "Login Failed!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Video Section, completely hidden on mobile */}
      <div className="hidden lg:block w-1/2 h-full relative">
        <Image
          src="/assets/login-banner.jpg" // Ensure the image path is correct
          alt="Vitar Logo"
          layout="fill" // This ensures the image covers the entire container
          objectFit="cover" // Ensures the image covers the area without being distorted
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white text-black">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/vitar-logo.png" // Ensure the logo path is correct
              alt="Vitar Logo"
              width={200}
              height={80}
              priority
            />
          </div>

          {/* Login Form */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Login to Your Account
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="loginInput"
              >
                Email Address or Worker ID
              </label>
              <input
                type="text"
                id="loginInput"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-red-500"
                placeholder="Enter your email or Worker ID"
                required // Add required attribute
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-red-500"
                placeholder="Enter your password"
                required // Add required attribute
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <a href="#" className="text-sm text-red-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            {error && (
              <p className="text-red-600 text-center mt-4">{error.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
