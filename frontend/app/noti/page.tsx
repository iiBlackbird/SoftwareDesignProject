"use client";

import { useState, useEffect } from "react";
import Head from 'next/head';
import Link from 'next/link';

// Navigation Bar Component
function NavigationBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'New Event Assignment',
      message: 'You have been assigned to "Beach Cleanup Day"',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'update',
      title: 'Event Schedule Changed',
      message: 'The "Food Drive" event has been rescheduled',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Upcoming Event Reminder',
      message: 'Remember your commitment to "Park Restoration"',
      time: '1 day ago',
      read: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getNotificationIcon = (type) => {
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

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              VolunteerWindow
            </span>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/discover" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Discover
            </Link>
            <Link 
              href="/notifications" 
              className="text-green-600 dark:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Notifications
            </Link>
            <Link 
              href="/my-events" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              My Events
            </Link>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search opportunities..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell Icon with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md transition-colors"
              >
                <i className="far fa-bell text-xl"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 mt-2">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map(notification => {
                      const { icon, color } = getNotificationIcon(notification.type);
                      return (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                              <i className={`${icon} text-xs`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/notifications"
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href="/organize" 
              className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              For Organizers
            </Link>
            
            <div className="flex items-center space-x-2">
              <Link
                href="/signin"
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 p-2"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search opportunities..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Notification Item Component
function NotificationItem({ notification, onMarkAsRead }) {
  const getNotificationIcon = (type) => {
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
function FilterSidebar({ activeFilter, onFilterChange, notificationCounts }) {
  const filters = [
    { key: 'all', label: 'All Notifications', icon: 'fas fa-inbox', count: notificationCounts.all },
    { key: 'unread', label: 'Unread', icon: 'fas fa-envelope', count: notificationCounts.unread },
    { key: 'assignment', label: 'Assignments', icon: 'fas fa-tasks', count: notificationCounts.assignment },
    { key: 'update', label: 'Updates', icon: 'fas fa-info-circle', count: notificationCounts.update },
    { key: 'reminder', label: 'Reminders', icon: 'fas fa-clock', count: notificationCounts.reminder },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h3>
      
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
function EmptyState({ filter }) {
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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'New Event Assignment',
      message: 'You have been assigned to "Beach Cleanup Day" on Saturday, October 15.',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'update',
      title: 'Event Schedule Changed',
      message: 'The "Food Drive" event has been rescheduled to November 5th.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Upcoming Event Reminder',
      message: 'Remember your commitment to "Park Restoration" this Saturday at 9 AM.',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'assignment',
      title: 'New Volunteer Role',
      message: 'You have been assigned as Team Lead for the "Homeless Shelter Dinner" event.',
      time: '2 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'update',
      title: 'Volunteer Requirements Updated',
      message: 'The requirements for "Community Garden" have been updated.',
      time: '3 days ago',
      read: true,
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Training Session Reminder',
      message: 'Your volunteer training session is scheduled for tomorrow at 2 PM.',
      time: '4 days ago',
      read: true,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate notification counts
  const notificationCounts = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    assignment: notifications.filter(n => n.type === 'assignment').length,
    update: notifications.filter(n => n.type === 'update').length,
    reminder: notifications.filter(n => n.type === 'reminder').length,
  };

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Refresh notifications (simulate API call)
  const refreshNotifications = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown') && !event.target.closest('.notification-bell')) {
        // This would close the dropdown if we had access to its state here
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Notifications - VolunteerWindow</title>
        <meta name="description" content="Manage your volunteering notifications" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
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