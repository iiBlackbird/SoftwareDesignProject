"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NavigationBar from '../../../../components/NavigationBar';

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

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  requiredSkills: string[];
  urgency: Urgency;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    location: "",
    requiredSkills: [] as string[],
    urgency: "" as "" | Urgency,
    eventDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API endpoint
        const response = await fetch(`${API_URL}/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.statusText}`);
        }
        
        const result = await response.json();
        const event: Event = result.data;
        
        // Convert eventDate to YYYY-MM-DD format for date input
        const eventDate = new Date(event.eventDate).toISOString().split('T')[0];
        
        setForm({
          eventName: event.name,
          description: event.description,
          location: event.location,
          requiredSkills: event.requiredSkills,
          urgency: event.urgency,
          eventDate: eventDate,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

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
      setSaving(true);
      setError(null);
      
      // TODO: Replace with actual API endpoint
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Event updated successfully:", result);
      
      // Redirect back to events list or event detail page
      router.push('/events');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mt-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading event...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationBar />
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mt-8">
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">
              Error Loading Event
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Event
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="pt-2 flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-lg font-semibold transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg text-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}