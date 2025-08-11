'use client';
import { useAuth } from '../lib/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      redirect('/dashboard');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <LandingPage />;
}
