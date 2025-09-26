"use client";

import { useState } from "react";
import NavigationBar from '../../components/NavigationBar';

const states = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  // ... add all 50 states
];

const skillsList = [
  "Event Planning",
  "Fundraising",
  "First Aid",
  "Teaching",
  "Cooking",
  "Driving",
  "Logistics",
];

export default function ProfilePage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData({ ...formData, skills: values });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dates = Array.from(e.target.files ?? []).map((file) => file.name);
    setFormData({ ...formData, availability: dates });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          User Profile Management
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              maxLength={50}
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>

          {/* Address 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address 1 *
            </label>
            <input
              type="text"
              name="address1"
              maxLength={100}
              required
              value={formData.address1}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>

          {/* Address 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address 2
            </label>
            <input
              type="text"
              name="address2"
              maxLength={100}
              value={formData.address2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City *
            </label>
            <input
              type="text"
              name="city"
              maxLength={100}
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State *
            </label>
            <select
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="">Select a state</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Zip */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Zip Code *
            </label>
            <input
              type="text"
              name="zip"
              maxLength={9}
              minLength={5}
              required
              value={formData.zip}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Skills *
            </label>
            <select
              multiple
              required
              value={formData.skills}
              onChange={handleMultiSelect}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferences
            </label>
            <textarea
              name="preferences"
              rows={3}
              value={formData.preferences}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Availability Dates *
            </label>
            <input
              type="date"
              multiple
              required
              name="availability"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: [...formData.availability, e.target.value],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
            {formData.availability.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {formData.availability.map((date, idx) => (
                  <li key={idx}>{date}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
