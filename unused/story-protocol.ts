import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { StoryProtocolResponse } from '@/types';

// Story Network Testnet configuration
const storyTestnet = {
  id: 1315,
  name: 'Story Testnet',
  network: 'story-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Explorer',
      url: 'https://testnet.storyscan.xyz',
    },
  },
  testnet: true,
};

const rpcUrl = process.env.RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io';
const privateKey = process.env.WALLET_PRIVATE_KEY as `0x${string}`;

if (!privateKey) {
  console.warn('WALLET_PRIVATE_KEY not set - Story Protocol integration will not work');
}

// Initialize Story Protocol client
const account = privateKey ? privateKeyToAccount(privateKey) : undefined;

const config: StoryConfig = {
  account: account!,
  transport: http(rpcUrl),
  chainId: 'iliad', // Story testnet chain ID
};

let client: any;
try {
  client = StoryClient.newClient(config);
} catch (error) {
  console.error('Failed to initialize Story Protocol client:', error);
}

export async function registerIPAsset(
  ipfsHash: string,
  metadata: {
    title: string;
    description: string;
    author: string;
  }
): Promise<StoryProtocolResponse> {
  try {
    if (!client) {
      throw new Error('Story Protocol client not initialized');
    }

    console.log('Registering IP Asset on Story Protocol with IPFS hash:', ipfsHash);

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

    console.log('Story Protocol registration successful:', {
      ipAssetId: response.ipId,
      txHash: response.txHash,
    });

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
    if (!client) {
      throw new Error('Story Protocol client not initialized');
    }

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
    if (!client) {
      throw new Error('Story Protocol client not initialized');
    }

    const ipAsset = await client.ipAsset.getIpAsset(ipAssetId);
    return ipAsset;
  } catch (error) {
    console.error('Failed to get IP asset details:', error);
    throw new Error('Failed to fetch IP asset details');
  }
}

export function getBlockExplorerUrl(txHash: string): string {
  return `https://testnet.storyscan.xyz/tx/${txHash}`;
}
