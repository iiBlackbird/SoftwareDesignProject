"use client";

import { useEffect, useState } from "react";
import NavigationBar from "@/components/NavigationBar";

const states = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const skillsList = [
  "Event Planning",
  "Teaching",
  "First Aid",
  "Fundraising",
  "Cooking",
  "Logistics",
  "Photography",
  "Driving",
  "Social Media",
];

export default function UserProfile() {
  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    skills: [] as string[],
    preferences: "",
    availability: [] as string[],
  });

  const [message, setMessage] = useState<string | null>("Loading profile...");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("You must be logged in to access your profile.");
      setMessage(null);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setMessage("Complete your profile to get started.");
          return;
        }

        const text = await res.text();
        if (!text) {
          setMessage("Complete your profile to get started.");
          return;
        }

        const data = JSON.parse(text);
        if (!data || Object.keys(data).length === 0) {
          setMessage("Complete your profile to get started.");
          return;
        }

        setFormData({
          fullName: data.fullName || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zipcode || "",
          skills: data.skills || [],
          preferences: data.preferences || "",
          availability: data.availability
            ? data.availability.map((d: string) =>
                new Date(d).toISOString().split("T")[0]
              )
            : [],
        });
        setMessage(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Complete your profile to get started.");
      });
  }, []);

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    
    // FIX: Only add date if user actually selected one (not empty from month navigation)
    if (!date) return;
    
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(date)
        ? prev.availability.filter((d) => d !== date)
        : [...prev.availability, date],
    }));

    // FIX: Clear the input after selection
    e.target.value = '';
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setMessage(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />

      <header className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Manage your volunteer details and preferences
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {message && (
            <div className="text-center text-gray-700 dark:text-gray-300 mb-6">
              {message}
            </div>
          )}
          {error && (
            <div className="text-red-600 dark:text-red-400 mb-4 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 dark:text-green-400 mb-4 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={50}
                required
                className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Address 1
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                maxLength={100}
                required
                className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Address 2 (optional)
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                maxLength={100}
                className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  pattern="^\d{5,9}$"
                  required
                  className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Skills (select one or more)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {skillsList.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="accent-emerald-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Preferences (optional)
              </label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Availability (select one or more dates)
              </label>
              <input
                type="date"
                onChange={handleAvailabilityChange}
                className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.availability.map((date) => (
                  <span
                    key={date}
                    className="bg-emerald-100 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-100 px-3 py-1 rounded-full text-sm"
                  >
                    {date}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}