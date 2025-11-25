"use client";

import { useEffect, useState } from "react";
import NavigationBar from '../../../components/NavigationBar';

type VolunteerRecord = {
  id: number;
  volunteerName: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: string;
  eventDate: string;
  participationStatus: string;
};

export default function VolunteerHistory() {
  const [history, setHistory] = useState<VolunteerRecord[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/volunteer-history`)
    //fetch(`http://localhost:3000/admin/volunteer-history`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const downloadFile = async (type: 'csv' | 'pdf') => {
    try {
      //const response = await fetch(`http://localhost:3000/admin/reports/volunteer-history/${type}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/volunteer-history/${type}`);
      if (!response.ok) {
        console.error("Failed to download file:", response.statusText);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `volunteer_history.${type}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Volunteer History
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Track the volunteer history
          </p>

          {/* Add buttons for CSV and PDF download */}
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={() => downloadFile('csv')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Download CSV
            </button>
            <button onClick={() => downloadFile('pdf')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Volunteer Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Event Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Description</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Location</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Required Skills</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Urgency</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Event Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Participation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{record.volunteerName}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{record.eventName}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.eventDescription}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.location}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.requiredSkills?.join(", ")}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.urgency}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.eventDate}</td>
                  <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">{record.participationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
