'use client';

import { useState, useEffect } from 'react';
import { useAccount, useEnsName, useEnsAvatar } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { normalize } from 'viem/ens';
import { templates, TemplateName } from '@/lib/templates';
import { MinimalTemplate } from './card-templates/MinimalTemplate';
import { CorporateTemplate } from './card-templates/CorporateTemplate';
import { CreativeTemplate } from './card-templates/CreativeTemplate';
import { DarkTemplate } from './card-templates/DarkTemplate';
import { GradientTemplate } from './card-templates/GradientTemplate';

interface ProfileData {
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
}

interface ProfileBuilderProps {
  onSave: (data: ProfileData) => Promise<void>;
  initialData?: ProfileData;
}

export default function ProfileBuilder({ onSave, initialData }: ProfileBuilderProps) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const [profile, setProfile] = useState<ProfileData>(initialData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingENS, setIsLoadingENS] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get ENS name if available
  const { data: ensName } = useEnsName({
    address: address || undefined,
    chainId: 1,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    chainId: 1,
  });

  // Load ENS data when connected
  useEffect(() => {
    if (isConnected && address && ensName) {
      loadENSData();
    }
  }, [isConnected, address, ensName]);

  const loadENSData = async () => {
    if (!ensName) return;
    
    setIsLoadingENS(true);
    try {
      const response = await fetch(`/api/profiles/ens?ensName=${ensName}`);
      const { profile: ensProfile } = await response.json();
      
      setProfile((prev) => ({
        ...prev,
        name: prev.name || ensProfile.name || ensName,
        avatar: prev.avatar || ensProfile.avatar || ensAvatar || undefined,
        email: prev.email || ensProfile.email || undefined,
        website: prev.website || ensProfile.url || undefined,
        twitter: prev.twitter || ensProfile.twitter || undefined,
        github: prev.github || ensProfile.github || undefined,
        bio: prev.bio || ensProfile.description || undefined,
      }));
    } catch (err) {
      console.error('Error loading ENS data:', err);
    } finally {
      setIsLoadingENS(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave(profile);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomLink = () => {
    setProfile((prev) => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { label: '', url: '' }],
    }));
  };

  const updateCustomLink = (index: number, field: 'label' | 'url', value: string) => {
    setProfile((prev) => {
      const links = [...(prev.customLinks || [])];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, customLinks: links };
    });
  };

  const removeCustomLink = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      customLinks: prev.customLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Build Your Digital Card
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Connect your wallet to get started. We'll automatically load your ENS profile if you have one.
        </p>
        <button
          onClick={() => open({})}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Edit Your Profile
          </h2>
          {ensName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Connected as: <span className="font-mono">{ensName}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Profile saved successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={profile.title || ''}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={profile.avatar || ''}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Card Template
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(templates) as TemplateName[]).map((templateKey) => {
                const template = templates[templateKey];
                const isSelected = (profile.template || 'minimal') === templateKey;
                return (
                  <button
                    key={templateKey}
                    type="button"
                    onClick={() => setProfile({ ...profile, template: templateKey })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{template.preview}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profile.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter/X
              </label>
              <input
                type="text"
                value={profile.twitter || ''}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                value={profile.linkedin || ''}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                placeholder="username"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <input
                type="text"
                value={profile.github || ''}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Farcaster
              </label>
              <input
                type="text"
                value={profile.farcaster || ''}
                onChange={(e) => setProfile({ ...profile, farcaster: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                placeholder="@username"
              />
            </div>
          </div>

          {/* Custom Links */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Links
              </label>
              <button
                type="button"
                onClick={addCustomLink}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                + Add Link
              </button>
            </div>
            {profile.customLinks?.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateCustomLink(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeCustomLink(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-8 h-fit">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Live Preview
          </h3>
          <CardPreview profile={profile} />
        </div>
      </div>
    </div>
  );
}

function CardPreview({ profile }: { profile: ProfileData }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8">
      <div className="text-center">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={profile.name || 'Avatar'}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-700"
          />
        )}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {profile.name || 'Your Name'}
        </h3>
        {profile.title && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.title}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{profile.bio}</p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {profile.website && (
            <a
              href={profile.website}
              className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Website
            </a>
          )}
          {profile.twitter && (
            <a
              href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
              className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Twitter
            </a>
          )}
          {profile.github && (
            <a
              href={`https://github.com/${profile.github}`}
              className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

