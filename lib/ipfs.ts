import { PinataSDK } from 'pinata-web3';
import { ArticleMetadata, IPFSUploadResponse } from '@/types';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

export async function uploadToIPFS(
  metadata: ArticleMetadata
): Promise<IPFSUploadResponse> {
  try {
    const upload = await pinata.upload.json(metadata);

    return {
      IpfsHash: upload.IpfsHash,
      PinSize: upload.PinSize,
      Timestamp: upload.Timestamp,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    const upload = await pinata.upload.file(file);
    return upload.IpfsHash;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${hash}`;
}

export async function fetchFromIPFS(hash: string): Promise<any> {
  try {
    const url = getIPFSUrl(hash);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }
    return await response.json();
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}
