'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';
import ProfileBuilder from '@/components/ProfileBuilder';
import DigitalCard from '@/components/DigitalCard';

interface Profile {
  _id?: string;
  slug?: string;
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  farcaster?: string;
  github?: string;
  instagram?: string;
  customLinks?: Array<{ label: string; url: string }>;
  template?: string;
  isPublished?: boolean;
  viewCount?: number;
  [key: string]: any;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'analytics'>('edit');

  useEffect(() => {
    if (isConnected && address) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const loadProfile = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/profiles?walletAddress=${address}`);
      const { profiles } = await response.json();
      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    if (!address) return;

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const { profile: savedProfile } = await response.json();
      setProfile(savedProfile);
    } catch (error) {
      throw error;
    }
  };

  const handlePublish = async () => {
    if (!profile || !address) return;

    try {
      const response = await fetch(`/api/profiles/${profile.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          isPublished: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish profile');
      }

      const { profile: updatedProfile } = await response.json();
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error publishing profile:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to access your dashboard and build your digital card.
          </p>
          <button
            onClick={() => open({})}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const cardUrl = profile?.slug
    ? `${window.location.origin}/card/${profile.slug}`
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            {profile?.slug && (
              <div className="flex items-center gap-4">
                {profile.isPublished ? (
                  <a
                    href={`/card/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    View Card
                  </a>
                ) : (
                  <button
                    onClick={handlePublish}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Publish Card
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'edit'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'preview'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'edit' && (
          <ProfileBuilder onSave={handleSave} initialData={profile || undefined} />
        )}

        {activeTab === 'preview' && profile && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <DigitalCard profile={profile} cardUrl={cardUrl} />
          </div>
        )}

        {activeTab === 'analytics' && profile && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Total Views
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.viewCount || 0}
                </p>
              </div>
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Status
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Card URL
                </p>
                {profile.slug ? (
                  <a
                    href={`/card/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    /card/{profile.slug}
                  </a>
                ) : (
                  <p className="text-gray-400">Not available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

