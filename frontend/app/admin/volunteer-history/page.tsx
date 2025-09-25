"use client";

import { useState } from "react";
import { NavigationBar } from '../../page';
import { Navigation } from "@mui/icons-material";

// example data until database is populated
const volunteerHistory = [
  {
    id: 1,
    volunteerName: "John Smith",
    eventName: "Blood Drive",
    eventDescription: "First Aid Event",
    location: "Red Cross",
    requiredSkills: ["First Aid"],
    urgency: "Medium",
    eventDate: "2025-10-10",
    participationStatus: "Attending",
  },
  {
    id: 2,
    volunteerName: "Karen John",
    eventName: "Meal Kit Assembly",
    eventDescription: "Volunteers assemble pre-portioned ingredients and recipes into meal kits",
    location: "School",
    requiredSkills: ["Cooking"],
    urgency: "High",
    eventDate: "2025-11-15",
    participationStatus: "Attending",
  },
];


export default function VolunteerHistory() {
    const [history, setHistory] = useState(volunteerHistory);
  
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* <NavigationBar /> */}
        <NavigationBar />
        {/* Page header */}
        <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Volunteer History
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Track the volunteer history
            </p>
          </div>
        </header>
  
        {/* Table */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Volunteer Name
                  </th>
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
                    Participation Status
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
                      {record.volunteerName}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {record.eventName}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.eventDescription}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.location}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.requiredSkills.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.urgency}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {record.eventDate}
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                      {record.participationStatus}
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