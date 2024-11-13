"use client"

import { TokenBucket } from '@/types/supply';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BLOCKS_PER_WEEK } from '@/lib/constants';
import { FormattedVOI } from './FormattedNumber';

interface CumulativeEmissionsGraphProps {
  buckets: TokenBucket[];
  totalSupply: bigint;
}

interface EmissionPoint {
  week: number;
  totalEmitted: number;
  [key: string]: number;
}

const COLORS = {
  'Block Rewards': '#2563eb',
  'Community Early Incentives': '#16a34a',
  'Community Mid Incentives': '#15803d',
  'Community Late Incentives': '#166534',
  'Treasury Early': '#9333ea',
  'Treasury Mid': '#7e22ce',
  'Treasury Late': '#6b21a8',
  'Core Team/Employees': '#c026d3',
  'Investor Private': '#e11d48',
  'Investor Pre-Seed': '#be123c',
  'Investor Seed': '#9f1239',
};

const calculateBlockRewardsEmissions = (week: number): number => {
  let totalEmitted = 0;
  // Sum up all weekly emissions up to this week
  for (let w = 0; w <= week; w++) {
    totalEmitted += 3_000_000 * Math.pow(0.9972, w);
  }
  return totalEmitted;
};

const calculateLinearVesting = (
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

const calculateBucketEmissions = (bucket: TokenBucket, week: number): number => {
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

const calculateEmissionsData = (buckets: TokenBucket[], totalSupply: bigint): EmissionPoint[] => {
  const data: EmissionPoint[] = [];
  const totalWeeks = 1040; // 20 years
  let hasReachedTotal = false;

  for (let week = 0; week <= totalWeeks && !hasReachedTotal; week++) {
    const point: EmissionPoint = { week, totalEmitted: 0 };
    let weekTotal = 0;

    buckets.forEach(bucket => {
      const emitted = calculateBucketEmissions(bucket, week);
      point[bucket.name] = emitted;
      weekTotal += emitted;
    });

    point.totalEmitted = weekTotal;
    data.push(point);

    // Stop if we've reached total supply
    if (weekTotal >= Number(totalSupply) / 1e9) {
      hasReachedTotal = true;
    }
  }

  return data;
};

export function CumulativeEmissionsGraph({ buckets, totalSupply }: CumulativeEmissionsGraphProps) {
  const data = calculateEmissionsData(buckets, totalSupply);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-12">
      <h2 className="text-2xl font-bold mb-6">Cumulative Token Emissions</h2>
      <div className="h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis 
              dataKey="week" 
              tickFormatter={(week) => `${Math.floor(week / 52)} years`}
              label={{ value: 'Time', position: 'bottom' }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
              label={{ value: 'VOI', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} VOI`, 
                name
              ]}
              labelFormatter={(week) => `Year ${(week / 52).toFixed(1)}`}
            />
            <Legend />
            {buckets.map((bucket) => (
              <Area
                key={bucket.name}
                type="monotone"
                dataKey={bucket.name}
                stackId="1"
                stroke={COLORS[bucket.name as keyof typeof COLORS]}
                fill={COLORS[bucket.name as keyof typeof COLORS]}
                fillOpacity={0.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing cumulative token emissions over time. Each color represents a different bucket&apos;s contribution.
        Block rewards are calculated weekly and accumulated over time.
      </div>
    </div>
  );
}