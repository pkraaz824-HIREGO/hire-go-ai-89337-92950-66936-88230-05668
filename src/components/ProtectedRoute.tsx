import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'candidate' | 'employer';
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (allowedRole && userRole !== allowedRole) {
        // Redirect to appropriate dashboard
        navigate(userRole === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
      }
    }
  }, [user, userRole, loading, allowedRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (allowedRole && userRole !== allowedRole)) {
    return null;
  }

  return <>{children}</>;
};
