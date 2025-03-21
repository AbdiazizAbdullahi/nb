'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import { useAuthStore } from '@/stores/authStore';

export default function ClientLayout({ children }) {
  const router = useRouter();
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    clearUser();
    router.push('/login');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}