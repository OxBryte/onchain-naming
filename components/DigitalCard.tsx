'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Profile {
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
  slug?: string;
}

interface DigitalCardProps {
  profile: Profile;
  cardUrl?: string;
}

export default function DigitalCard({ profile, cardUrl }: DigitalCardProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (cardUrl) {
      QRCode.toDataURL(cardUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCode(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [cardUrl]);

  const getSocialUrl = (platform: string, handle: string) => {
    const cleanHandle = handle.replace('@', '');
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${cleanHandle}`;
      case 'github':
        return `https://github.com/${cleanHandle}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanHandle}`;
      case 'farcaster':
        return `https://warpcast.com/${cleanHandle}`;
      case 'instagram':
        return `https://instagram.com/${cleanHandle}`;
      default:
        return '#';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.name || 'Avatar'}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white dark:border-gray-700 shadow-lg"
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {profile.name || 'Anonymous'}
          </h1>
          {profile.title && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {profile.title}
            </p>
          )}
          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        {(profile.email || profile.phone || profile.website) && (
          <div className="mb-8 space-y-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile.phone}
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {profile.website}
              </a>
            )}
          </div>
        )}

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {profile.twitter && (
            <a
              href={getSocialUrl('twitter', profile.twitter)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Twitter
            </a>
          )}
          {profile.github && (
            <a
              href={getSocialUrl('github', profile.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              GitHub
            </a>
          )}
          {profile.linkedin && (
            <a
              href={getSocialUrl('linkedin', profile.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              LinkedIn
            </a>
          )}
          {profile.farcaster && (
            <a
              href={getSocialUrl('farcaster', profile.farcaster)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Farcaster
            </a>
          )}
          {profile.instagram && (
            <a
              href={getSocialUrl('instagram', profile.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Instagram
            </a>
          )}
          {profile.customLinks?.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* QR Code */}
        {qrCode && (
          <div className="flex justify-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Scan to share
              </p>
              <img src={qrCode} alt="QR Code" className="mx-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

