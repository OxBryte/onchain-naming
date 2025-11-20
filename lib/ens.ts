import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export interface ENSProfile {
  name: string | null;
  address: string;
  avatar?: string | null;
  description?: string | null;
  email?: string | null;
  url?: string | null;
  twitter?: string | null;
  github?: string | null;
  telegram?: string | null;
  discord?: string | null;
}

/**
 * Resolve ENS name to address
 */
export async function resolveENSName(name: string): Promise<string | null> {
  try {
    const normalizedName = normalize(name);
    const address = await publicClient.getEnsAddress({
      name: normalizedName,
    });
    return address;
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return null;
  }
}

/**
 * Resolve address to ENS name
 */
export async function resolveENSAddress(address: string): Promise<string | null> {
  try {
    const name = await publicClient.getEnsName({
      address: address as `0x${string}`,
    });
    return name;
  } catch (error) {
    console.error('Error resolving ENS address:', error);
    return null;
  }
}

/**
 * Get ENS avatar
 */
export async function getENSAvatar(name: string): Promise<string | null> {
  try {
    const normalizedName = normalize(name);
    const avatar = await publicClient.getEnsAvatar({
      name: normalizedName,
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
export async function getENSTextRecord(
  name: string,
  key: string
): Promise<string | null> {
  try {
    const normalizedName = normalize(name);
    const text = await publicClient.getEnsText({
      name: normalizedName,
      key,
    });
    return text;
  } catch (error) {
    console.error(`Error getting ENS text record for ${key}:`, error);
    return null;
  }
}

/**
 * Get full ENS profile with all available data
 */
export async function getENSProfile(nameOrAddress: string): Promise<ENSProfile | null> {
  try {
    let ensName: string | null = null;
    let address: string | null = null;

    // Check if input is an address or ENS name
    if (nameOrAddress.startsWith('0x')) {
      address = nameOrAddress;
      ensName = await resolveENSAddress(address);
    } else {
      ensName = nameOrAddress;
      address = await resolveENSName(ensName);
    }

    if (!address || !ensName) {
      return null;
    }

    // Fetch all text records in parallel
    const [avatar, description, email, url, twitter, github, telegram, discord] =
      await Promise.all([
        getENSAvatar(ensName),
        getENSTextRecord(ensName, 'description'),
        getENSTextRecord(ensName, 'email'),
        getENSTextRecord(ensName, 'url'),
        getENSTextRecord(ensName, 'com.twitter'),
        getENSTextRecord(ensName, 'com.github'),
        getENSTextRecord(ensName, 'org.telegram'),
        getENSTextRecord(ensName, 'com.discord'),
      ]);

    return {
      name: ensName,
      address,
      avatar,
      description,
      email,
      url,
      twitter,
      github,
      telegram,
      discord,
    };
  } catch (error) {
    console.error('Error getting ENS profile:', error);
    return null;
  }
}

/**
 * Generate unique slug from ENS name or wallet address
 */
export function generateSlug(ensNameOrAddress: string): string {
  if (ensNameOrAddress.endsWith('.eth')) {
    return ensNameOrAddress.replace('.eth', '').toLowerCase();
  }
  // For addresses, use first 8 chars
  return ensNameOrAddress.slice(0, 10).toLowerCase();
}

