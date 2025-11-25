"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from '../../../components/NavigationBar';

const skillsList = [
  "Event Planning",
  "Fundraising",
  "First Aid",
  "Teaching",
  "Cooking",
  "Driving",
  "Logistics",
  "Photography",
  "Social Media",
];

const urgencies = ["Low", "Normal", "High", "Critical"] as const;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Urgency = (typeof urgencies)[number];

export default function NewEventPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    eventName: "",
    description: "",
    location: "",
    requiredSkills: [] as string[],
    urgency: "" as "" | Urgency,
    eventDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm((f) => ({ ...f, requiredSkills: values }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
      
      const result = await response.json();
      console.log("Event created successfully:", result);
      
      // Redirect to events list or success page
      router.push('/events');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create Event
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Name *
            </label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              required
              maxLength={100}
              value={form.eventName}
              onChange={onChange}
              disabled={loading}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., Community Park Clean-up"
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={onChange}
              disabled={loading}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describe the event goals, tasks, schedule, etc."
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location *
            </label>
            <textarea
              id="location"
              name="location"
              required
              rows={3}
              value={form.location}
              onChange={onChange}
              disabled={loading}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Address, venue details, or meeting point"
            />
          </div>

          {/* Required Skills */}
          <div>
            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Required Skills * (Ctrl/Cmd-click to choose multiple)
            </label>
            <select
              id="requiredSkills"
              name="requiredSkills"
              multiple
              required
              value={form.requiredSkills}
              onChange={onSkillsChange}
              disabled={loading}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {skillsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Urgency *
            </label>
            <select
              id="urgency"
              name="urgency"
              required
              value={form.urgency}
              onChange={onChange}
              disabled={loading}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select urgency</option>
              {urgencies.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Date *
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              required
              value={form.eventDate}
              onChange={onChange}
              disabled={loading}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg text-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Save Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
