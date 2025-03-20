'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NoticeCard from '@/components/NoticeCard';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      
      if (data.success) {
        setNotices(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to fetch notices');
    }
  };

  const handleDelete = async (noticeId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/notices/${noticeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setNotices(notices.filter(notice => notice._id !== noticeId));
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to delete notice');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-2xl mb-12 p-8 sm:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            KEMU Events Board
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Stay updated with the latest events and announcements
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
        {user?.isSuperAdmin && (
          <button
            onClick={() => router.push('/notices/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Notice
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {notices.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          No notices available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              isAdmin={user?.isSuperAdmin}
              onDelete={handleDelete}
              // onEdit={(notice) => router.push(`/notices/edit/${notice._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
