
"use client";

import { useState, useEffect } from "react";
import { NavigationBar } from '../../page';

// example data for volunteers and events until db is populated
const volunteers = [
  { id: 1, name: "John Smith", suggestedEvent: "Blood Drive" },
  { id: 2, name: "Karen John", suggestedEvent: "Meal Kit Assembly" },
];

const events = [
  "Blood Drive",
  "Meal Kit Assembly",
  "Cooking Class",
];

export default function VolunteerMatchingPage() {
  const [assignments, setAssignments] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const initialAssignments: { [id: number]: string } = {};
    volunteers.forEach((v) => {
      initialAssignments[v.id] = v.suggestedEvent;
    });
    setAssignments(initialAssignments);
  }, []);

  const handleChange = (volunteerId: number, newEvent: string) => {
    setAssignments((prev) => ({ ...prev, [volunteerId]: newEvent }));
  };

  const handleAssign = (volunteerId: number) => {
    const assignedEvent = assignments[volunteerId];
    alert(
      `Assigned ${assignedEvent} to ${
        volunteers.find((v) => v.id === volunteerId)?.name
      }`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Volunteer Matching
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Match volunteers with events
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Volunteer Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Suggested Event
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Change Event
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {volunteers.map((volunteer) => (
                <tr
                  key={volunteer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    {volunteer.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {volunteer.suggestedEvent}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={assignments[volunteer.id]}
                      onChange={(e) => handleChange(volunteer.id, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {events.map((eventName, idx) => (
                        <option key={idx} value={eventName}>
                          {eventName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAssign(volunteer.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}