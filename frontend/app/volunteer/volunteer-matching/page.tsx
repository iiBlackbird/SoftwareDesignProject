"use client";

import { useEffect, useState } from "react";
import NavigationBar from "../../../components/NavigationBar";

type Match = {
  eventId: number;
  eventName: string;
  description: string;
  location: string;
  eventDate: string;
  status: string;
};

export default function VolunteerMatchingPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [enrolled, setEnrolled] = useState<{ [id: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch matched volunteer opportunities from backend
  useEffect(() => {
    fetch("http://localhost:3000/user/volunteer-matching")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }
        return res.json();
      })
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setError("Failed to load matched opportunities.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      {/* Header */}
      <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Matched Opportunities
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            See volunteering opportunities matched to your profile
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          {loading ? (
            <p className="p-6 text-gray-600 dark:text-gray-300">
              Loading matched opportunities...
            </p>
          ) : error ? (
            <p className="p-6 text-red-600 dark:text-red-400">{error}</p>
          ) : matches.length === 0 ? (
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
                    key={m.eventId}
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
                      {enrolled[m.eventId] ? (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          Enrolled
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setEnrolled((prev) => ({ ...prev, [m.eventId]: true }))
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
