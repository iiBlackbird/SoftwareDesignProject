"use client";

import { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';
import NavigationBar from '../../components/NavigationBar';

// Types
interface Notification {
  id: number;
  type: 'assignment' | 'update' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
  userId?: number;
  eventId?: number;
}

interface NotificationCounts {
  all: number;
  unread: number;
  assignment: number;
  update: number;
  reminder: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    counts: NotificationCounts;
  };
}

// API Service Functions
const API_BASE_URL = 'http://localhost:3001';

const notificationAPI = {
  // Fetch notifications for a user
  async getNotifications(userId: number, filter?: string): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('filter', filter);
      
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    } catch (error) {
      console.warn('API unavailable, using fallback data');
      throw error; // Will trigger fallback to hardcoded data
    }
  },

  // Mark notifications as read
  async markAsRead(userId: number, notificationIds: number[]): Promise<{ success: boolean; data: { markedCount: number } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      });
      if (!response.ok) throw new Error('Failed to mark notifications as read');
      return response.json();
    } catch (error) {
      console.warn('API unavailable, using local state only');
      // Return success for local state updates even if API fails
      return { success: true, data: { markedCount: notificationIds.length } };
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: number): Promise<{ success: boolean; data: { markedCount: number } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}/mark-all-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return response.json();
    } catch (error) {
      console.warn('API unavailable, using local state only');
      // Return success for local state updates
      return { success: true, data: { markedCount: 1 } };
    }
  },
};

// Fallback hardcoded data for when API is unavailable
const fallbackNotifications: Notification[] = [
  {
    id: 1,
    type: 'assignment',
    title: 'New Event Assignment',
    message: 'You have been assigned to "Beach Cleanup Day" on Saturday, October 15.',
    time: '10 minutes ago',
    read: false,
    userId: 1,
    eventId: 1,
  },
  {
    id: 2,
    type: 'update',
    title: 'Event Schedule Changed',
    message: 'The "Food Drive" event has been rescheduled to November 5th.',
    time: '2 hours ago',
    read: false,
    userId: 1,
    eventId: 2,
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Upcoming Event Reminder',
    message: 'Remember your commitment to "Park Restoration" this Saturday at 9 AM.',
    time: '1 day ago',
    read: true,
    userId: 1,
    eventId: 3,
  },
  {
    id: 4,
    type: 'assignment',
    title: 'New Volunteer Role',
    message: 'You have been assigned as Team Lead for the "Homeless Shelter Dinner" event.',
    time: '2 days ago',
    read: true,
    userId: 1,
    eventId: 4,
  },
  {
    id: 5,
    type: 'update',
    title: 'Volunteer Requirements Updated',
    message: 'The requirements for "Community Garden" have been updated.',
    time: '3 days ago',
    read: true,
    userId: 1,
    eventId: 5,
  },
  {
    id: 6,
    type: 'reminder',
    title: 'Training Session Reminder',
    message: 'Your volunteer training session is scheduled for tomorrow at 2 PM.',
    time: '4 days ago',
    read: true,
    userId: 1,
    eventId: 6,
  },
];

// Calculate fallback counts
const getFallbackCounts = (notifications: Notification[]): NotificationCounts => ({
  all: notifications.length,
  unread: notifications.filter(n => !n.read).length,
  assignment: notifications.filter(n => n.type === 'assignment').length,
  update: notifications.filter(n => n.type === 'update').length,
  reminder: notifications.filter(n => n.type === 'reminder').length,
});

// Notification Item Component
function NotificationItem({ notification, onMarkAsRead }: { 
  notification: Notification; 
  onMarkAsRead: (id: number) => void;
}) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return { icon: 'fas fa-tasks', color: 'bg-green-100 text-green-600' };
      case 'update':
        return { icon: 'fas fa-info-circle', color: 'bg-blue-100 text-blue-600' };
      case 'reminder':
        return { icon: 'fas fa-clock', color: 'bg-yellow-100 text-yellow-600' };
      default:
        return { icon: 'fas fa-bell', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const { icon, color } = getNotificationIcon(notification.type);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
      !notification.read ? 'border-l-4 border-l-green-500' : 'border-gray-200 dark:border-gray-700'
    } p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          <i className={`${icon} text-sm`}></i>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {notification.title}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
              {notification.time}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-3">
              <button className="text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                View Details
              </button>
              {notification.type === 'assignment' && (
                <button className="text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                  Accept Assignment
                </button>
              )}
            </div>
            
            {!notification.read && (
              <button 
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ 
  activeFilter, 
  onFilterChange, 
  notificationCounts,
  usingFallback = false
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  notificationCounts: NotificationCounts;
  usingFallback?: boolean;
}) {
  const filters = [
    { key: 'all', label: 'All Notifications', icon: 'fas fa-inbox', count: notificationCounts.all },
    { key: 'unread', label: 'Unread', icon: 'fas fa-envelope', count: notificationCounts.unread },
    { key: 'assignment', label: 'Assignments', icon: 'fas fa-tasks', count: notificationCounts.assignment },
    { key: 'update', label: 'Updates', icon: 'fas fa-info-circle', count: notificationCounts.update },
    { key: 'reminder', label: 'Reminders', icon: 'fas fa-clock', count: notificationCounts.reminder },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        {usingFallback && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Offline Mode
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
              activeFilter === filter.key
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <i className={`${filter.icon} w-4 text-center`}></i>
              <span className="text-sm font-medium">{filter.label}</span>
            </div>
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <i className="fas fa-bell-slash text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No notifications found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        {filter === 'all' 
          ? "You're all caught up! There are no notifications at the moment."
          : `There are no ${filter} notifications matching your current filter.`
        }
      </p>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        View All Notifications
      </button>
    </div>
  );
}

// Main Notifications Page Component
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(fallbackNotifications);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>(
    getFallbackCounts(fallbackNotifications)
  );
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Current user ID (in a real app, this would come from authentication)
  const currentUserId = 1;

  // Load notifications from backend with fallback or N/A
  const loadNotifications = async () => {
    try {
      setError(null);
      setUsingFallback(false);
      
      const response = await notificationAPI.getNotifications(
        currentUserId, 
        activeFilter === 'all' ? undefined : activeFilter
      );
      
      if (response.success) {
        setNotifications(response.data.notifications);
        setNotificationCounts(response.data.counts);
      }
    } catch (err) {
      // Use fallback data when API is unavailable
      setUsingFallback(true);
      setError('Backend unavailable. Using hardcode/demo data.');
      
      // Filter fallback data based on active filter
      let filteredFallback = fallbackNotifications;
      if (activeFilter !== 'all') {
        if (activeFilter === 'unread') {
          filteredFallback = fallbackNotifications.filter(n => !n.read);
        } else {
          filteredFallback = fallbackNotifications.filter(n => n.type === activeFilter);
        }
      }
      
      setNotifications(filteredFallback);
      setNotificationCounts(getFallbackCounts(filteredFallback));
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on component mount and when filter changes
  useEffect(() => {
    loadNotifications();
  }, [activeFilter]);

  // Mark a notification as read
  const markAsRead = async (id: number) => {
    try {
      const response = await notificationAPI.markAsRead(currentUserId, [id]);
      
      if (response.success) {
        // Update local state to reflect the change
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        // Update counts
        setNotificationCounts(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      }
    } catch (err) {
      // If API fails, update local state for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setNotificationCounts(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await notificationAPI.markAllAsRead(currentUserId);
      
      if (response.success) {
        // Update local state to reflect all notifications are read
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        // Update counts
        setNotificationCounts(prev => ({
          ...prev,
          unread: 0
        }));
      }
    } catch (err) {
      // If API fails, update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setNotificationCounts(prev => ({
        ...prev,
        unread: 0
      }));
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    setIsRefreshing(true);
    try {
      await loadNotifications();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner animate-spin text-4xl text-green-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Notifications - VolunteerWindow</title>
        <meta name="description" content="Manage your volunteering notifications" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        {usingFallback && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-wifi text-yellow-500 mr-3"></i>
              <div>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                  Status: Offline
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-xs">
                  Backend unavailable. Showing hardcode/demo data. Changes will not persist.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && !usingFallback && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <FilterSidebar 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              notificationCounts={notificationCounts}
              usingFallback={usingFallback}
            />
          </div>

          {/* Notifications List */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                  Notifications
                  {notificationCounts.unread > 0 && (
                    <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                      {notificationCounts.unread} unread
                    </span>
                  )}
                </h1>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={markAllAsRead}
                    disabled={notificationCounts.unread === 0}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark All as Read
                  </button>
                  
                  <button 
                    onClick={refreshNotifications}
                    disabled={isRefreshing}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <i className={`fas ${isRefreshing ? 'fa-spinner animate-spin' : 'fa-sync-alt'}`}></i>
                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationItem 
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))
                ) : (
                  <EmptyState filter={activeFilter} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}