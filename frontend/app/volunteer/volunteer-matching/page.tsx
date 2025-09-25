"use client";

import { useState } from "react";
import { NavigationBar } from "../../page";

export default function VolunteerMatchingPage() {
  // example data until database is populated
  const [matches, setMatches] = useState([
    {
      id: 1,
      eventName: "Blood Drive",
      description: "First Aid Event.",
      location: "Red Cross",
      eventDate: "2025-10-10",
    },
  ]);

  // Track which events the user has enrolled in
  const [enrolled, setEnrolled] = useState<{ [id: number]: boolean }>({});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Matched Opportunities
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            See volunteering opportunities matched to you
          </p>
        </div>
      </header>

      {/* Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          {matches.length === 0 ? (
            <p className="p-6 text-gray-600 dark:text-gray-300">
              You don’t have any matched events yet.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Event
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {matches.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {m.eventName}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {m.description}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {m.location}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {m.eventDate}
                    </td>
                    <td className="py-3 px-4">
                      {enrolled[m.id] ? (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          Enrolled
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setEnrolled((prev) => ({ ...prev, [m.id]: true }))
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Enroll
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
