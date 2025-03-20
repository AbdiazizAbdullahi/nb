import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ user, onLogout }) {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link href="/" className="flex items-center py-4">
              <span className="font-semibold text-white text-lg">Notice</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  href="/archive"
                  className={`py-2 px-2 font-medium ${
                    pathname === '/archive'
                      ? 'text-white'
                      : 'text-gray-100 hover:text-white'
                  }`}
                >
                  Archive
                </Link>
                <span className="py-2 px-2 font-medium text-white">
                  Welcome, {user.firstName}
                </span>
                <button
                  onClick={onLogout}
                  className="py-2 px-2 font-medium text-red-200 hover:text-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`py-2 px-2 font-medium ${
                    pathname === '/login'
                      ? 'text-white'
                      : 'text-gray-100 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`py-2 px-2 font-medium ${
                    pathname === '/register'
                      ? 'text-white'
                      : 'text-gray-100 hover:text-white'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}