import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { createPublicClient, createWalletClient, http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { StoryProtocolResponse } from '@/types';

const chainId = parseInt(process.env.NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID || '11155111');
const rpcUrl = process.env.NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL!;
const privateKey = process.env.STORY_PROTOCOL_PRIVATE_KEY as `0x${string}`;

// Create viem clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
});

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
});

// Initialize Story Protocol client
const config: StoryConfig = {
  account: account,
  transport: http(rpcUrl),
  chainId: 'sepolia',
};

const client = StoryClient.newClient(config);

export async function registerIPAsset(
  ipfsHash: string,
  metadata: {
    title: string;
    description: string;
    author: string;
  }
): Promise<StoryProtocolResponse> {
  try {
    // Register the IP Asset with Story Protocol
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
      pilType: 'non-commercial-remix',
      metadata: {
        metadataURI: `ipfs://${ipfsHash}`,
        metadataHash: ipfsHash,
        nftMetadataHash: ipfsHash,
      },
      txOptions: { waitForTransaction: true },
    });

    if (!response.txHash) {
      throw new Error('Transaction failed');
    }

    return {
      ipAssetId: response.ipId as string,
      tokenId: response.tokenId?.toString() || '',
      licenseTermsId: response.licenseTermsId?.toString() || '',
      transactionHash: response.txHash,
    };
  } catch (error) {
    console.error('Story Protocol registration error:', error);
    throw new Error('Failed to register IP asset');
  }
}

export async function attachLicenseTerms(
  ipAssetId: Address,
  licenseTermsId: bigint
): Promise<string> {
  try {
    const response = await client.license.attachLicenseTerms({
      ipId: ipAssetId,
      licenseTermsId,
      txOptions: { waitForTransaction: true },
    });

    return response.txHash || '';
  } catch (error) {
    console.error('License attachment error:', error);
    throw new Error('Failed to attach license terms');
  }
}

export async function getIPAssetDetails(ipAssetId: Address) {
  try {
    const ipAsset = await client.ipAsset.getIpAsset(ipAssetId);
    return ipAsset;
  } catch (error) {
    console.error('Failed to get IP asset details:', error);
    throw new Error('Failed to fetch IP asset details');
  }
}

export function getBlockExplorerUrl(txHash: string): string {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
