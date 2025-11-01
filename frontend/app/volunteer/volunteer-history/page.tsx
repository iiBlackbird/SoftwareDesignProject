"use client";

import { useEffect, useState } from "react";
import NavigationBar from "../../../components/NavigationBar";

type VolunteerRecord = {
  id: string;
  status: string;
  event: {
    id: string;
    name: string;
    description: string;
    location: string;
    requiredSkills: string[];
    urgency: string;
    eventDate: string;
  };
};

export default function UserVolunteerHistory() {
  const [history, setHistory] = useState<VolunteerRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); 

    if (!token) {
      setError("You must be logged in to view your volunteer history.");
      return;
    }

    fetch("http://localhost:3000/user/volunteer-history", {
      headers: {
        Authorization: `Bearer ${token}`, // send JWT to backend
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || "Failed to fetch volunteer history");
        }
        return res.json();
      })
      .then((data) =>
        setHistory(
          data.map((item: any) => ({
            ...item,
            event: {
              ...item.event,
              eventDate: new Date(item.event.eventDate).toLocaleDateString(),
            },
          }))
        )
      )
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Volunteer History
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Review your past and upcoming volunteer activities
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Event Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Required Skills
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Urgency
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Event Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {record.event.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.event.description}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.event.location}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.event.requiredSkills.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.event.urgency}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.event.eventDate}
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

