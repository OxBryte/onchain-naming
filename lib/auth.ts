import { SiweMessage } from 'siwe';
import { getAddress } from 'viem';

export interface AuthMessage {
  message: string;
  signature: `0x${string}`;
  address: string;
}

/**
 * Create SIWE message for authentication
 */
export function createAuthMessage(address: string, nonce: string): string {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
  const origin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

  const message = new SiweMessage({
    domain,
    address: getAddress(address),
    statement: 'Sign in to OnChain Naming',
    uri: origin,
    version: '1',
    chainId: 1,
    nonce,
  });

  return message.prepareMessage();
}

/**
 * Verify SIWE message
 */
export async function verifyAuthMessage(
  message: string,
  signature: `0x${string}`,
  address: string
): Promise<boolean> {
  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({
      signature,
    });

    return (
      fields.data.address.toLowerCase() === address.toLowerCase() &&
      fields.success
    );
  } catch (error) {
    console.error('Error verifying auth message:', error);
    return false;
  }
}

/**
 * Generate nonce for authentication
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
