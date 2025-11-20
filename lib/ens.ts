import { createPublicClient, http, normalize } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export interface ENSProfile {
  name?: string;
  avatar?: string;
  email?: string;
  url?: string;
  twitter?: string;
  github?: string;
  description?: string;
  [key: string]: string | undefined;
}

/**
 * Resolve ENS name to address
 */
export async function resolveENS(ensName: string): Promise<string | null> {
  try {
    const normalized = normalize(ensName);
    const address = await publicClient.getEnsAddress({
      name: normalized,
    });
    return address;
  } catch (error) {
    console.error('Error resolving ENS:', error);
    return null;
  }
}

/**
 * Resolve address to ENS name
 */
export async function resolveAddress(address: `0x${string}`): Promise<string | null> {
  try {
    const name = await publicClient.getEnsName({
      address,
    });
    return name;
  } catch (error) {
    console.error('Error resolving address:', error);
    return null;
  }
}

/**
 * Get ENS avatar
 */
export async function getENSAvatar(ensName: string): Promise<string | null> {
  try {
    const normalized = normalize(ensName);
    const avatar = await publicClient.getEnsAvatar({
      name: normalized,
    });
    return avatar;
  } catch (error) {
    console.error('Error getting ENS avatar:', error);
    return null;
  }
}

/**
 * Get ENS text records
 */
export async function getENSTextRecords(ensName: string): Promise<ENSProfile> {
  try {
    const normalized = normalize(ensName);
    const profile: ENSProfile = {};

    // Common text record keys
    const textRecordKeys = [
      'email',
      'url',
      'avatar',
      'description',
      'com.twitter',
      'com.github',
      'com.linkedin',
      'com.discord',
      'org.telegram',
    ];

    for (const key of textRecordKeys) {
      try {
        const value = await publicClient.getEnsText({
          name: normalized,
          key,
        });
        if (value) {
          // Map common keys to our profile structure
          if (key === 'com.twitter') {
            profile.twitter = value;
          } else if (key === 'com.github') {
            profile.github = value;
          } else {
            profile[key] = value;
          }
        }
      } catch (err) {
        // Continue if one text record fails
        continue;
      }
    }

    // Get avatar separately
    const avatar = await getENSAvatar(normalized);
    if (avatar) {
      profile.avatar = avatar;
    }

    profile.name = normalized;

    return profile;
  } catch (error) {
    console.error('Error getting ENS text records:', error);
    return {};
  }
}

/**
 * Generate slug from ENS name or address
 */
export function generateSlug(ensName?: string, address?: string): string {
  if (ensName) {
    // Remove .eth suffix and clean up
    const cleaned = ensName.toLowerCase().replace(/\.eth$/, '').replace(/[^a-z0-9]/g, '');
    return cleaned || `ens-${Date.now()}`;
  }
  if (address) {
    // Use first 8 chars of address (without 0x)
    return address.toLowerCase().slice(2, 10);
  }
  throw new Error('Either ensName or address must be provided');
}
