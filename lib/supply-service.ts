import { SupplyData, TokenBucket, CategorySummary, BucketCategory } from '@/types/supply';

// Helper to convert months to blocks (3 second blocks)
const monthsToBlocks = (months: number) => Math.floor((months * 30 * 24 * 60 * 60) / 3);

// Helper to convert VOI to base units (9 decimals)
const VOI = (amount: number) => BigInt(Math.floor(amount * 1e9));

const calculateCategorySummaries = (buckets: TokenBucket[], totalSupply: bigint): Record<BucketCategory, CategorySummary> => {
  const summaries: Partial<Record<BucketCategory, CategorySummary>> = {};
  
  buckets.forEach(bucket => {
    if (!summaries[bucket.category]) {
      summaries[bucket.category] = {
        totalAmount: 0n,
        availableAmount: 0n,
        distributedAmount: 0n,
        percentage: 0,
        bucketCount: 0
      };
    }
    
    const summary = summaries[bucket.category]!;
    summary.totalAmount += bucket.totalAmount;
    summary.availableAmount += bucket.availableAmount;
    summary.distributedAmount += (bucket.totalAmount - bucket.currentAmount);
    summary.bucketCount += 1;
  });

  // Calculate percentages after all buckets are summed
  Object.values(summaries).forEach(summary => {
    summary.percentage = Number(summary.totalAmount * 100n / totalSupply);
  });

  return summaries as Record<BucketCategory, CategorySummary>;
};

export async function fetchSupplyData(): Promise<SupplyData> {
  const currentBlock = 1234567;
  const totalSupply = VOI(10_000_000_000);
  
  const buckets: TokenBucket[] = [
    {
      id: 'BLOCK_REWARDS',
      name: 'Block Rewards',
      category: 'Community',
      percentage: 10,
      totalAmount: VOI(1_000_000_000),
      currentAmount: VOI(1_000_000_000),
      lockupBlocks: 0,
      vestingSchedule: {
        startBlock: 0,
        endBlock: monthsToBlocks(240), // 20 years
        releaseType: 'NON_LINEAR',
        formula: '3000000*(0.9972)^Week'
      },
      availableAmount: VOI(50_000_000),
      isCompliant: true
    },
    {
      id: 'COMMUNITY_EARLY',
      name: 'Community Early Incentives',
      category: 'Community',
      percentage: 15,
      totalAmount: VOI(1_500_000_000),
      currentAmount: VOI(1_500_000_000),
      lockupBlocks: 0,
      vestingSchedule: {
        startBlock: 0,
        endBlock: monthsToBlocks(60),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(100_000_000),
      isCompliant: true
    },
    {
      id: 'COMMUNITY_MID',
      name: 'Community Mid Incentives',
      category: 'Community',
      percentage: 30,
      totalAmount: VOI(3_000_000_000),
      currentAmount: VOI(3_000_000_000),
      lockupBlocks: 0,
      vestingSchedule: {
        startBlock: monthsToBlocks(60),
        endBlock: monthsToBlocks(180),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'COMMUNITY_LATE',
      name: 'Community Late Incentives',
      category: 'Community',
      percentage: 20,
      totalAmount: VOI(2_000_000_000),
      currentAmount: VOI(2_000_000_000),
      lockupBlocks: monthsToBlocks(60),
      vestingSchedule: {
        startBlock: monthsToBlocks(60),
        endBlock: monthsToBlocks(180),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'TREASURY_EARLY',
      name: 'Treasury Early',
      category: 'Block Authority',
      percentage: 3.27,
      totalAmount: VOI(327_000_000),
      currentAmount: VOI(327_000_000),
      lockupBlocks: 0,
      vestingSchedule: {
        startBlock: 0,
        endBlock: 0,
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(327_000_000),
      isCompliant: true
    },
    {
      id: 'TREASURY_MID',
      name: 'Treasury Mid',
      category: 'Block Authority',
      percentage: 5,
      totalAmount: VOI(500_000_000),
      currentAmount: VOI(500_000_000),
      lockupBlocks: monthsToBlocks(24),
      vestingSchedule: {
        startBlock: monthsToBlocks(24),
        endBlock: monthsToBlocks(24),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'TREASURY_LATE',
      name: 'Treasury Late',
      category: 'Block Authority',
      percentage: 5,
      totalAmount: VOI(500_000_000),
      currentAmount: VOI(500_000_000),
      lockupBlocks: monthsToBlocks(60),
      vestingSchedule: {
        startBlock: monthsToBlocks(60),
        endBlock: monthsToBlocks(60),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'CORE_TEAM',
      name: 'Core Team/Employees',
      category: 'Block Authority',
      percentage: 10,
      totalAmount: VOI(1_000_000_000),
      currentAmount: VOI(1_000_000_000),
      lockupBlocks: monthsToBlocks(24),
      vestingSchedule: {
        startBlock: monthsToBlocks(24),
        endBlock: monthsToBlocks(36),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'INVESTOR_PRIVATE',
      name: 'Investor Private',
      category: 'Investors',
      percentage: 0.56,
      totalAmount: VOI(56_000_000),
      currentAmount: VOI(56_000_000),
      lockupBlocks: monthsToBlocks(24),
      vestingSchedule: {
        startBlock: monthsToBlocks(24),
        endBlock: monthsToBlocks(36),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'INVESTOR_PRE_SEED',
      name: 'Investor Pre-Seed',
      category: 'Investors',
      percentage: 1.01,
      totalAmount: VOI(101_000_000),
      currentAmount: VOI(101_000_000),
      lockupBlocks: monthsToBlocks(24),
      vestingSchedule: {
        startBlock: monthsToBlocks(24),
        endBlock: monthsToBlocks(36),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    },
    {
      id: 'INVESTOR_SEED',
      name: 'Investor Seed',
      category: 'Investors',
      percentage: 0.16,
      totalAmount: VOI(16_000_000),
      currentAmount: VOI(16_000_000),
      lockupBlocks: monthsToBlocks(12),
      vestingSchedule: {
        startBlock: monthsToBlocks(12),
        endBlock: monthsToBlocks(12),
        releaseType: 'LINEAR'
      },
      availableAmount: VOI(0),
      isCompliant: true
    }
  ];

  const categorySummaries = calculateCategorySummaries(buckets, totalSupply);

  return {
    currentBlock,
    totalSupply,
    distributedSupply: VOI(477_000_000),
    availableSupply: VOI(327_000_000),
    buckets,
    categorySummaries
  };
}