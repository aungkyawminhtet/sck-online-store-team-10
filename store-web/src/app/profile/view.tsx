'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/hooks/use-user-store';
import getPointService, { GetPointServiceResponse } from '@/services/point';
import Button from '@/components/button/button';

export default function ProfileView() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [point, setPoint] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      // If no user, redirect to login
      router.push('/auth/login');
      return;
    }
    const fetchPoint = async () => {
      const res: GetPointServiceResponse = await getPointService();
      if (res.data?.point !== undefined) {
        setPoint(res.data.point);
      }
      setLoading(false);
    };
    fetchPoint();
  }, [user, router]);

  const handleLogout = () => {
    clearUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    router.push('/auth/login');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-60 backdrop-blur-md rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Profile Settings
        </h1>
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {user.firstName}{' '}
            {user.lastName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Username:</span> {user.username}
          </p>
        </div>
        <div className="mb-6">
          {loading ? (
            <p className="text-gray-600">Loading points…</p>
          ) : (
            <p className="text-gray-700">
              <span className="font-medium">Points:</span> {point}
            </p>
          )}
        </div>
        <Button onClick={handleLogout} isblock="true" className="mt-2">
          Logout
        </Button>
        <div className="mt-4 text-center">
          <Link
            href="/product/list"
            className="text-sm text-gray-600 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
