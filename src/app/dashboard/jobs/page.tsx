"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
// query, where,
import { db } from "@/app/firebase/config";
import Button from "@/app/components/common/Button";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  technician: string;
  customer: string;
  equipment: string[];
  dateTime: string;
  status: string;
  type: string;
  priority: boolean;
};

const JobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showPriority, setShowPriority] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const router = useRouter();

  // Fetch job data from Firestore
  const fetchJobs = async () => {
    const jobsCollection = collection(db, "jobs");
    const jobsSnapshot = await getDocs(jobsCollection);

    const fetchedJobs: Job[] = jobsSnapshot.docs.map((doc) => {
      const jobData = doc.data() as Job;
      return { ...jobData, id: doc.id };
    });
    setJobs(fetchedJobs);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearchTerm = job.customer
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || job.type === selectedType;
    const matchesPriority = showPriority ? job.priority : true;
    return matchesSearchTerm && matchesType && matchesPriority;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / entriesPerPage)
  );
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredJobs.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  const handleAdd = () => {
    router.push("/dashboard/jobs/add");
  };

  const handleEdit = (jobId: string) => {
    router.push(`/dashboard/jobs/${jobId}/edit`);
  };

  return (
    <div className="p-8 lg:p-12 bg-white h-screen overflow-x-hidden">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4 py-8 lg:mb-0">
        Jobs
      </h1>

      {/* Search and Add Job Button */}
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex gap-4 mb-4 lg:mb-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <Button type="button" label="Add Job" onClick={handleAdd} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-black mb-4 lg:mb-0"
        >
          {["All", "Site", "Sub-Contract", "Lab"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label className="flex items-center ml-4 text-black">
          <input
            type="checkbox"
            checked={showPriority}
            onChange={() => setShowPriority((prev) => !prev)}
            className="mr-2"
          />
          Show Priority Jobs Only
        </label>
      </div>

      {/* Job Table */}
      <div className="relative overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md h-[500px]">
        <table className="w-full text-sm text-left text-gray-600 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-3">Job ID</th>
              <th className="px-6 py-3">Technician</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Equipment</th>
              <th className="px-6 py-3">Date & Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {currentEntries.length > 0 ? (
              currentEntries.map((job) => (
                <tr key={job.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {job.id}
                  </td>
                  <td className="px-6 py-4">{job.technician}</td>
                  <td className="px-6 py-4">{job.customer}</td>
                  <td className="px-6 py-4">{job.equipment.join(", ")}</td>
                  <td className="px-6 py-4">{job.dateTime}</td>
                  <td className="px-6 py-4">{job.status}</td>
                  <td className="px-6 py-4">{job.type}</td>
                  <td className="px-6 py-4">{job.priority ? "High" : "Low"}</td>
                  <td className="px-6 py-4 text-center">
                    {/* Three-dot menu button */}
                    <button
                      onClick={() =>
                        setDropdownOpen((prev) => ({
                          ...prev,
                          [job.id]: !prev[job.id],
                        }))
                      }
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      ⋮
                    </button>
                    {dropdownOpen[job.id] && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                        <button
                          onClick={() => handleEdit(job.id)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/dashboard/jobs/${job.id}/view`)
                          }
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => console.log("Cancel Job", job.id)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Cancel Job
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <span className="mx-2 text-black">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages < 1}
            className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
              currentPage === totalPages || totalPages < 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
        <div>
          <label className="text-gray-600 mr-2">Entries per page:</label>
          <select
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
