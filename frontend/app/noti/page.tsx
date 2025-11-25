"use client";

import { useState, useEffect, useCallback } from "react";
import Head from 'next/head';
import Link from 'next/link';
import NavigationBar from '../../components/NavigationBar';

// Types
interface Notification {
  id: string;
  type: 'assignment' | 'update' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
  userId?: string;
  eventId?: string;
  createdAt: string;
  event?: {
    id: string;
    name: string;
    eventDate?: string;
    location?: string;
  };
}

interface NotificationCounts {
  all: number;
  unread: number;
  assignment: number;
  update: number;
  reminder: number;
}

// API Service Functions
//const API_BASE_URL = 'http://localhost:3001';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) return `${Math.floor(diffInHours * 60)} minutes ago`;
  if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
  return `${Math.floor(diffInHours / 24)} days ago`;
};

const notificationAPI = {
  // Fetch notifications for a user
  async getNotifications(options?: { 
    unreadOnly?: boolean; 
    limit?: number; 
    page?: number; 
  }): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      if (options?.unreadOnly) params.append('unreadOnly', 'true');
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());
      
      const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        throw new Error('Unauthorized - Please login again');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch notifications: ${response.status} - ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getUnreadCount(): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) throw new Error('Failed to fetch unread count');
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Mark single notification as read
  async markAsRead(notificationId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Fallback hardcoded data for when API is unavailable
const fallbackNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'assignment',
    title: 'New Event Matches Your Skills!',
    message: 'The event "Blood Drive" is looking for volunteers with skills like yours.',
    time: '2023-10-25T10:30:00Z',
    read: false,
    userId: 'user1',
    eventId: 'event1',
    createdAt: '2023-10-25T10:30:00Z',
  },
  {
    id: 'notif2',
    type: 'update',
    title: 'Event Updated',
    message: 'The event "Food Drive" has been updated. Please review the changes.',
    time: '2023-10-25T08:15:00Z',
    read: false,
    userId: 'user1',
    eventId: 'event2',
    createdAt: '2023-10-25T08:15:00Z',
  },
  {
    id: 'notif3',
    type: 'reminder',
    title: 'Event Reminder',
    message: 'Reminder: The event "Park Restoration" is coming up soon!',
    time: '2023-10-24T14:20:00Z',
    read: true,
    userId: 'user1',
    eventId: 'event3',
    createdAt: '2023-10-24T14:20:00Z',
  },
  {
    id: 'notif4',
    type: 'assignment',
    title: 'New Volunteer Role Assigned',
    message: 'You have been assigned as Team Lead for the "Homeless Shelter Dinner" event.',
    time: '2023-10-23T16:45:00Z',
    read: false,
    userId: 'user1',
    eventId: 'event4',
    createdAt: '2023-10-23T16:45:00Z',
  },
  {
    id: 'notif5',
    type: 'update',
    title: 'Volunteer Requirements Updated',
    message: 'The requirements for "Community Garden" have been updated with new safety guidelines.',
    time: '2023-10-22T11:20:00Z',
    read: true,
    userId: 'user1',
    eventId: 'event5',
    createdAt: '2023-10-22T11:20:00Z',
  },
  {
    id: 'notif6',
    type: 'reminder',
    title: 'Training Session Reminder',
    message: 'Your volunteer training session is scheduled for tomorrow at 2 PM at the community center.',
    time: '2023-10-21T09:10:00Z',
    read: true,
    userId: 'user1',
    eventId: 'event6',
    createdAt: '2023-10-21T09:10:00Z',
  },
  {
    id: 'notif7',
    type: 'assignment',
    title: 'Emergency Response Team',
    message: 'Your skills are needed for the emergency flood relief effort this weekend.',
    time: '2023-10-20T14:30:00Z',
    read: false,
    userId: 'user1',
    eventId: 'event7',
    createdAt: '2023-10-20T14:30:00Z',
  },
  {
    id: 'notif8',
    type: 'update',
    title: 'Schedule Change',
    message: 'The "Beach Cleanup" event has been moved to next Saturday due to weather conditions.',
    time: '2023-10-19T17:25:00Z',
    read: true,
    userId: 'user1',
    eventId: 'event8',
    createdAt: '2023-10-19T17:25:00Z',
  },
  {
    id: 'notif9',
    type: 'reminder',
    title: 'Documentation Deadline',
    message: 'Remember to submit your volunteer hours documentation by end of day tomorrow.',
    time: '2023-10-18T10:15:00Z',
    read: true,
    userId: 'user1',
    eventId: 'event9',
    createdAt: '2023-10-18T10:15:00Z',
  },
  {
    id: 'notif10',
    type: 'assignment',
    title: 'New Mentorship Opportunity',
    message: 'You have been matched with a new volunteer for the mentorship program starting next week.',
    time: '2023-10-17T13:40:00Z',
    read: true,
    userId: 'user1',
    eventId: 'event10',
    createdAt: '2023-10-17T13:40:00Z',
  },
];

// Calculate fallback counts
const getFallbackCounts = (notifications: Notification[]): NotificationCounts => ({
  all: notifications.length,
  unread: notifications.filter((n: Notification) => !n.read).length,
  assignment: notifications.filter((n: Notification) => n.type === 'assignment').length,
  update: notifications.filter((n: Notification) => n.type === 'update').length,
  reminder: notifications.filter((n: Notification) => n.type === 'reminder').length,
});

// Notification Item Component
function NotificationItem({ notification, onMarkAsRead }: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
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

  const handleViewDetails = () => {
    if (notification.eventId) {
      window.location.href = `/events/${notification.eventId}`;
    }
  };

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
              {formatTime(notification.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          
          {notification.event && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Event: {notification.event.name}
              {notification.event.eventDate && ` • ${new Date(notification.event.eventDate).toLocaleDateString()}`}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-3">
              <button 
                onClick={handleViewDetails}
                className="text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
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
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  notificationCounts: NotificationCounts;
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
      <Link href="/events">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Browse Events
        </button>
      </Link>
    </div>
  );
}

// Main Notifications Page Component
export default function NotificationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>({
    all: 0,
    unread: 0,
    assignment: 0,
    update: 0,
    reminder: 0,
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }
    setIsAuthenticated(true);
  }, []);

  // Load notifications from backend
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setError(null);
      setLoading(true);
      
      const response = await notificationAPI.getNotifications({
        unreadOnly: activeFilter === 'unread',
        limit: 50,
        page: 1,
      });
      
      if (response.success) {
        const transformedNotifications = response.data.notifications.map((n: any) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: n.createdAt,
          read: n.read,
          userId: n.userId,
          eventId: n.eventId,
          createdAt: n.createdAt,
          event: n.event,
        }));
        
        setNotifications(transformedNotifications);
        setNotificationCounts(response.data.counts);
      }
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError(err.message || 'Failed to load notifications');
      
      // Use fallback data only for demo purposes
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
  }, [activeFilter, isAuthenticated]);

  // Load notifications on component mount and when filter changes
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [loadNotifications, isAuthenticated]);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await notificationAPI.markAsRead(id);
      
      if (response.success) {
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
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
      // Update UI optimistically
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
      const response = await notificationAPI.markAllAsRead();
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setNotificationCounts(prev => ({
          ...prev,
          unread: 0
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
      // Update UI optimistically
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner animate-spin text-4xl text-green-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-yellow-500 hover:text-yellow-700"
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