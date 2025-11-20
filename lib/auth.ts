import { verifyMessage } from 'viem';

/**
 * Generate authentication message for wallet signature
 */
export function generateAuthMessage(address: string, nonce: string): string {
  return `Welcome to OnChain Naming!

Please sign this message to authenticate your wallet.

Wallet: ${address}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any gas fees.`;
}

/**
 * Verify wallet signature
 */
export async function verifyWalletSignature(
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  try {
    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });
    return valid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Generate random nonce for authentication
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

