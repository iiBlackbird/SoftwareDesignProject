"use client";

import { useState, useEffect } from "react";
import NavigationBar from '../../../components/NavigationBar';

type VolunteerMatch = {
  volunteerId: string;
  volunteerName: string;
  suggestedEvent: string;
  suggestedEventId: string | null;
};

type EventOption = {
  id: string;
  name: string;
};

export default function VolunteerMatchingPage() {
  const [matches, setMatches] = useState<VolunteerMatch[]>([]);
  const [assignments, setAssignments] = useState<{ [id: string]: string | null }>({});
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Fetch suggested matches
        const resMatches = await fetch("http://localhost:3000/admin/volunteer-matching");
        if (!resMatches.ok) throw new Error("Failed to fetch matches");
        const matchesData: VolunteerMatch[] = await resMatches.json();
        setMatches(matchesData);

        // Initialize assignments
        const initialAssignments: { [id: string]: string | null } = {};
        matchesData.forEach((v) => {
          initialAssignments[v.volunteerId] = v.suggestedEventId;
        });
        setAssignments(initialAssignments);

        // 2️⃣ Fetch all upcoming events
        const resEvents = await fetch("http://localhost:3000/admin/events/upcoming");
        if (!resEvents.ok) throw new Error("Failed to fetch events");

        const eventsData = await resEvents.json();
        // Use the array property returned by your backend
        //setEvents(eventsData.events || []); 
        setEvents(eventsData || []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load volunteer matches or events.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (volunteerId: string, eventId: string) => {
    setAssignments((prev) => ({ ...prev, [volunteerId]: eventId }));
  };

  const handleAssign = async (volunteerId: string) => {
    const eventId = assignments[volunteerId];
    if (!eventId) {
      alert("Please select a valid event to assign.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/admin/volunteer-matching/assign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ volunteerId, eventId }),
        }
      );
      const data = await res.json();

      if (data.message.toLowerCase().includes("successfully")) {
        setMatches((prev) => prev.filter((v) => v.volunteerId !== volunteerId));
      }

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to assign volunteer.");
    }
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
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading matches...</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : (
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
                {matches.map((volunteer) => (
                  <tr
                    key={volunteer.volunteerId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {volunteer.volunteerName}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {volunteer.suggestedEvent}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={assignments[volunteer.volunteerId] || ""}
                        onChange={(e) =>
                          handleChange(volunteer.volunteerId, e.target.value)
                        }
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select Event</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAssign(volunteer.volunteerId)}
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
        )}
      </main>
    </div>
  );
}
