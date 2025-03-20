'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NoticeForm from '@/components/NoticeForm';

export default function EditNoticePage() {
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams()
  const id = params?.id

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/notices/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setNotice(data.data);
        } else {
          setError(data.error.message);
        }
      } catch (err) {
        setError('Failed to fetch notice');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNotice();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/');
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to update notice');
    }
  };

  if (!user?.isSuperAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          <p>You do not have permission to edit notices.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>Loading notice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Notice</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {notice && (
          <NoticeForm
            initialData={notice}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/')}
          />
        )}
      </div>
    </div>
  );
}