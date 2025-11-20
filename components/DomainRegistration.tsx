'use client';

import { useState } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

interface DomainRegistrationProps {
  domainName: string;
  onRegister: (domain: string, metadata: Record<string, string>, ownerAddress: string) => Promise<void>;
}

export default function DomainRegistration({ domainName, onRegister }: DomainRegistrationProps) {

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [metadata, setMetadata] = useState<Record<string, string>>({
    email: '',
    name: '',
    bio: '',
    website: '',
    twitter: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsRegistering(true);
    setError(null);
    setSuccess(false);

    try {
      // Filter out empty fields
      const filteredMetadata = Object.fromEntries(
        Object.entries(metadata).filter(([_, value]) => value.trim() !== '')
      );

      await onRegister(domainName, filteredMetadata, address);
      setSuccess(true);
      setMetadata({ email: '', name: '', bio: '', website: '', twitter: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register domain');
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Register Domain: {domainName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Connect your wallet to register this domain and save your information.
        </p>
        <button onClick={() => open({})}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Register Domain: {domainName}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Connected as: <span className="font-mono text-sm">{address}</span>
      </p>

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200 font-semibold">
            Domain registered successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={metadata.email}
            onChange={(e) => setMetadata({ ...metadata, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={metadata.name}
            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={metadata.bio}
            onChange={(e) => setMetadata({ ...metadata, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={metadata.website}
            onChange={(e) => setMetadata({ ...metadata, website: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Twitter/X
          </label>
          <input
            type="text"
            value={metadata.twitter}
            onChange={(e) => setMetadata({ ...metadata, twitter: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="@yourhandle"
          />
        </div>

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
        >
          {isRegistering ? 'Registering...' : 'Register Domain'}
        </button>
      </form>
    </div>
  );
}

