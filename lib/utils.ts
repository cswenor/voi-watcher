import { TokenBucket, BucketCategory } from '@/types/supply';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const blocksToReadable = (blocks: number): string => {
  const months = Math.floor((blocks * 3) / (30 * 24 * 60 * 60));
  if (months >= 12) {
    return `${(months / 12).toFixed(1)} years`;
  }
  return `${months} months`;
};

export const groupBuckets = (buckets: TokenBucket[]) => {
  const groups: Record<BucketCategory, {
    treasury?: TokenBucket[],
    core?: TokenBucket[],
    other?: TokenBucket[]
  }> = {
    'Community': { other: [] },
    'Block Authority': {
      treasury: [],
      core: [],
    },
    'Investors': { other: [] }
  };
  
  buckets.forEach(bucket => {
    if (bucket.category === 'Block Authority') {
      if (bucket.id.startsWith('TREASURY')) {
        groups['Block Authority'].treasury?.push(bucket);
      } else {
        groups['Block Authority'].core?.push(bucket);
      }
    } else {
      groups[bucket.category].other?.push(bucket);
    }
  });
  
  return groups;
};