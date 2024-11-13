export type BucketCategory = 'Community' | 'Block Authority' | 'Investors';

// Rest of the types remain the same
export interface VestingSchedule {
  startBlock: number;
  endBlock: number;
  releaseType: 'LINEAR' | 'NON_LINEAR';
  formula?: string;
}

export interface TokenBucket {
  id: string;
  name: string;
  category: BucketCategory;
  percentage: number;
  totalAmount: bigint;
  currentAmount: bigint;
  lockupBlocks: number;
  vestingSchedule: VestingSchedule;
  availableAmount: bigint;
  isCompliant: boolean;
}

export interface CategorySummary {
  totalAmount: bigint;
  availableAmount: bigint;
  distributedAmount: bigint;
  percentage: number;
  bucketCount: number;
}

export interface SupplyData {
  currentBlock: number;
  totalSupply: bigint;
  distributedSupply: bigint;
  availableSupply: bigint;
  buckets: TokenBucket[];
  categorySummaries: Record<BucketCategory, CategorySummary>;
}