'use client';

import { useEffect, useState } from 'react';
import NoticeCard from '@/components/NoticeCard';
import { useRouter } from 'next/navigation';

export default function ArchivePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArchivedNotices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/notices/archive', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch archived notices');
        }
        const result = await response.json();
        if (result.success) {
          setNotices(result.data);
        } else {
          throw new Error(result.error.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedNotices();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Archived Notices</h1>
      {notices.length === 0 ? (
        <p className="text-gray-600 text-center">No archived notices found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              archived={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}