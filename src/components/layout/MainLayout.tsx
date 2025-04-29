
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import { useLocation, Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const MainLayout = ({ children, requireAuth = false }: MainLayoutProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-blue-400">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full border-4 border-t-white border-r-white border-b-white border-l-transparent animate-spin"></div>
          <p className="text-lg font-medium text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-blue-400">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t py-6 shadow-inner">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Vote Central. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
