"use client";

import { useState } from "react";
import NavigationBar from "../../../components/NavigationBar";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadFile = async (
    report: "volunteer-history" | "event-assignments",
    type: "csv" | "pdf"
  ) => {
    try {
      setLoading(`${report}-${type}`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${report}/${type}`
      );

      if (!response.ok) {
        console.error("Download failed:", response.statusText);
        setLoading(null);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${report}.${type}`;
      link.click();

      window.URL.revokeObjectURL(url);
      setLoading(null);
    } catch (err) {
      console.error("Error downloading file:", err);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      {/* HEADER */}
      <header className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Admin Reports
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Download volunteer participation and event assignment reports.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 space-y-12">
        <section className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Volunteer Participation Report
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Includes:
          </p>

          <ul className="list-disc ml-6 mb-6 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Overview of all registered volunteers</li>
            <li>Record of events each volunteer has taken part in</li>
            <li>Attendance and participation status for each activity</li>
          </ul>

          <div className="flex gap-4">
            <button
              onClick={() => downloadFile("volunteer-history", "csv")}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {loading === "volunteer-history-csv" ? "Generating..." : "Download CSV"}
            </button>

            <button
              onClick={() => downloadFile("volunteer-history", "pdf")}
              className="px-5 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              {loading === "volunteer-history-pdf" ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Event Assignments Report
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Includes:
          </p>

          <ul className="list-disc ml-6 mb-6 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Complete list of scheduled and past events</li>
            <li>Volunteers associated with each event</li>
            <li>Key event information such as location, details, and urgency level</li>
          </ul>

          <div className="flex gap-4">
            <button
              onClick={() => downloadFile("event-assignments", "csv")}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {loading === "event-assignments-csv" ? "Generating..." : "Download CSV"}
            </button>

            <button
              onClick={() => downloadFile("event-assignments", "pdf")}
              className="px-5 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              {loading === "event-assignments-pdf" ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
