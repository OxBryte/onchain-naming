'use client';

import { useState } from 'react';
import DomainSearch from '@/components/DomainSearch';
import DomainRegistration from '@/components/DomainRegistration';
import { useAppKit } from '@reown/appkit/react';
export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { open } = useAppKit();
  const handleDomainSelect = (domain: string, address: string | null) => {
    setSelectedDomain(domain);
    setSelectedAddress(address);
  };

  const handleRegister = async (domain: string, metadata: Record<string, string>, ownerAddress: string) => {
    try {
      const response = await fetch('/api/domains/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainName: domain,
          ownerAddress,
          metadata,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register domain');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OnChain Naming
            </h1>
          </div>
          <button onClick={() => open({})}>Connect Wallet</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Own Your Digital Identity
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Register ENS domains and store your custom metadata securely on-chain and in our database
          </p>
        </div>

        {/* Domain Search */}
        <div className="flex justify-center mb-12">
          <DomainSearch onDomainSelect={handleDomainSelect} />
        </div>

        {/* Domain Registration Form */}
        {selectedDomain && (
          <div className="max-w-2xl mx-auto">
            <DomainRegistration domainName={selectedDomain} onRegister={handleRegister} />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Fast Registration
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Register ENS domains quickly and securely with your Web3 wallet
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Secure Storage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your domain data is stored securely in MongoDB with encryption
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Custom Metadata
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Store custom information like email, bio, social links, and more
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 OnChain Naming. Built with Next.js, Wagmi, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}
