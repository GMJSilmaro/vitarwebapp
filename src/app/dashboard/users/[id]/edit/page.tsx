"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string; // In practice, handle password securely
};

// Simulate fetching user data based on id
const fetchUserById = (id: string): User | null => {
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Elm Street",
      username: "johndoe",
      password: "hashedpassword1",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "234-567-8901",
      address: "456 Oak Avenue",
      username: "janesmith",
      password: "hashedpassword2",
    },
  ];

  return users.find((user) => user.id === id) || null;
};

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Specify that id is a string
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Fetch user by id and populate the form fields
    const fetchedUser = fetchUserById(id);
    if (fetchedUser) {
      setUser(fetchedUser);
      setName(fetchedUser.name);
      setEmail(fetchedUser.email);
      setPhone(fetchedUser.phone);
      setAddress(fetchedUser.address);
      setUsername(fetchedUser.username);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hash the password (in a real app, you'd handle this in the backend)
    const hashedPassword = `hashed_${password || user?.password}`;

    // Updated user data
    const updatedUser: User = {
      id,
      name,
      email,
      phone,
      address,
      username,
      password: hashedPassword,
    };

    // Submit the updated user data (Replace with actual API call)
    console.log("User updated:", updatedUser);

    // Redirect back to users list
    router.push("/dashboard/users");
  };

  return user ? (
    <div className="p-6 lg:p-12 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <small className="text-gray-500">
            Leave blank to keep current password
          </small>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Update User
        </button>
      </form>
    </div>
  ) : (
    <div className="p-6 lg:p-12 bg-white min-h-screen">
      <p>User not found</p>
    </div>
  );
};

export default EditUserPage;
