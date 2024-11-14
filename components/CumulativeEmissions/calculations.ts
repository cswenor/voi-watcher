import { TokenBucket } from '@/types/supply';
import { EmissionPoint } from './types';
import { TOTAL_WEEKS } from './constants';
import { BLOCKS_PER_WEEK } from '@/lib/constants';

export const calculateBlockRewardsEmissions = (week: number): number => {
  let totalEmitted = 0;
  // Sum up all weekly emissions up to this week
  for (let w = 0; w <= week; w++) {
    totalEmitted += 3_000_000 * Math.pow(0.9972, w);
  }
  return totalEmitted;
};

export const calculateLinearVesting = (
  currentWeek: number,
  lockupWeeks: number,
  vestingStartWeek: number,
  vestingEndWeek: number,
  totalAmount: bigint
): number => {
  // If we're in lock period, no emissions
  if (currentWeek < lockupWeeks) {
    return 0;
  }

  // Vesting starts after lock period
  const effectiveVestingStart = Math.max(lockupWeeks, vestingStartWeek);
  const effectiveVestingEnd = Math.max(lockupWeeks, vestingEndWeek);

  // If we're before vesting starts, no emissions
  if (currentWeek < effectiveVestingStart) {
    return 0;
  }

  // If we're after vesting ends, return total amount
  if (currentWeek >= effectiveVestingEnd) {
    return Number(totalAmount) / 1e9;
  }

  // Calculate linear progress
  const progress = (currentWeek - effectiveVestingStart) / 
                  (effectiveVestingEnd - effectiveVestingStart);
  return (Number(totalAmount) / 1e9) * progress;
};

export const calculateBucketEmissions = (bucket: TokenBucket, week: number): number => {
  if (bucket.vestingSchedule.releaseType === 'NON_LINEAR') {
    return calculateBlockRewardsEmissions(week);
  }

  const lockupWeeks = Math.ceil(bucket.lockupBlocks / BLOCKS_PER_WEEK);
  const vestingStartWeek = Math.ceil(bucket.vestingSchedule.startBlock / BLOCKS_PER_WEEK);
  const vestingEndWeek = Math.ceil(bucket.vestingSchedule.endBlock / BLOCKS_PER_WEEK);

  return calculateLinearVesting(
    week,
    lockupWeeks,
    vestingStartWeek,
    vestingEndWeek,
    bucket.totalAmount
  );
};

export const calculateEmissionsData = (buckets: TokenBucket[], totalSupply: bigint): EmissionPoint[] => {
  const data: EmissionPoint[] = [];
  
  // Always generate data for all weeks
  for (let week = 0; week <= TOTAL_WEEKS; week++) {
    const point: EmissionPoint = { week, totalEmitted: 0 };
    let weekTotal = 0;

    buckets.forEach(bucket => {
      const emitted = calculateBucketEmissions(bucket, week);
      point[bucket.name] = emitted;
      weekTotal += emitted;
    });

    point.totalEmitted = weekTotal;
    data.push(point);
  }

  return data;
};