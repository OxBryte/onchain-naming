'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEnsName, useEnsAddress } from 'wagmi';
import { normalize } from 'viem/ens';

interface DomainSearchProps {
  onDomainSelect?: (domain: string, address: string | null) => void;
}

export default function DomainSearch({ onDomainSelect }: DomainSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { address } = useAccount();

  // Check if the searched term is a valid ENS name
  const normalizedName = searchTerm.endsWith('.eth') ? normalize(searchTerm) : null;
  const { data: ensAddress, isLoading: isLoadingAddress } = useEnsAddress({
    name: normalizedName || undefined,
    chainId: 1,
    query: {
      enabled: !!normalizedName && normalizedName.length > 0,
    },
  });

  // Check if an address resolves to an ENS name
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: searchTerm.startsWith('0x') ? (searchTerm as `0x${string}`) : undefined,
    chainId: 1,
    query: {
      enabled: searchTerm.startsWith('0x') && searchTerm.length === 42,
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Wait a bit for the hooks to resolve
    setTimeout(() => {
      setIsSearching(false);
      if (onDomainSelect) {
        if (normalizedName) {
          onDomainSelect(normalizedName, ensAddress || null);
        } else if (ensName) {
          onDomainSelect(ensName, searchTerm as `0x${string}`);
        }
      }
    }, 500);
  };

  const isLoading = isLoadingAddress || isLoadingName || isSearching;

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for ENS domain (e.g., vitalik.eth) or Ethereum address"
          className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !searchTerm}
          className="absolute right-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {normalizedName && ensAddress && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200">
            <span className="font-semibold">{normalizedName}</span> resolves to{' '}
            <span className="font-mono text-sm">{ensAddress}</span>
          </p>
        </div>
      )}
      {ensName && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200">
            <span className="font-mono text-sm">{searchTerm}</span> resolves to{' '}
            <span className="font-semibold">{ensName}</span>
          </p>
        </div>
      )}
    </form>
  );
}

