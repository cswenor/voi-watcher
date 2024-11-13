"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenBucket } from "@/types/supply";
import { FormattedVOI } from "./FormattedNumber";

interface EmissionsModalProps {
  bucket: TokenBucket;
}

interface EmissionDataPoint {
  block: number;
  amount: number;
  weeklyRelease: number;
  totalReleased: number;
}

const BLOCKS_PER_WEEK = Math.floor((7 * 24 * 60 * 60) / 3); // 7 days in blocks at 3 second blocks

const calculateEmissions = (bucket: TokenBucket): EmissionDataPoint[] => {
  const data: EmissionDataPoint[] = [];
  
  if (bucket.vestingSchedule.releaseType === 'LINEAR') {
    const totalBlocks = bucket.vestingSchedule.endBlock - bucket.vestingSchedule.startBlock;
    const releasePerBlock = Number(bucket.totalAmount) / totalBlocks;
    
    // Sample 50 points for the graph
    for (let i = 0; i <= 50; i++) {
      const block = bucket.vestingSchedule.startBlock + (totalBlocks * (i / 50));
      const totalReleased = block >= bucket.lockupBlocks 
        ? releasePerBlock * (block - bucket.vestingSchedule.startBlock)
        : 0;
      
      data.push({
        block,
        amount: totalReleased / 1e9, // Convert from base units to VOI
        weeklyRelease: 0,
        totalReleased: totalReleased / 1e9
      });
    }
  } else if (bucket.vestingSchedule.releaseType === 'NON_LINEAR') {
    let totalReleased = 0;
    // Calculate for 20 years (1040 weeks)
    for (let week = 0; week <= 1040; week += 1) {
      const weeklyRelease = 3_000_000 * Math.pow(0.9972, week);
      totalReleased += weeklyRelease;
      
      data.push({
        block: week * BLOCKS_PER_WEEK,
        amount: totalReleased, // Cumulative total
        weeklyRelease: weeklyRelease, // Amount for this week
        totalReleased: totalReleased
      });
    }
  }

  return data;
};

export function EmissionsModal({ bucket }: EmissionsModalProps) {
  const emissionsData = calculateEmissions(bucket);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          View Emissions
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{bucket.name} Emissions Schedule</span>
            {bucket.vestingSchedule.releaseType === 'NON_LINEAR' && (
              <span className="text-sm font-normal text-gray-600">
                Weekly Release: {bucket.vestingSchedule.formula}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emissionsData}>
              <XAxis 
                dataKey="block" 
                tickFormatter={(block: number) => `${Math.floor(block * 3 / (7 * 24 * 60 * 60))}w`}
                label={{ value: 'Time (weeks)', position: 'bottom' }}
              />
              <YAxis 
                tickFormatter={(value: number) => `${(value / 1_000_000).toFixed(1)}M`}
                label={{ value: 'VOI', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'weeklyRelease') {
                    return [`${value.toLocaleString()} VOI`, 'Weekly Release'];
                  }
                  return [`${value.toLocaleString()} VOI`, 'Total Released'];
                }}
                labelFormatter={(block: number) => {
                  const weeks = Math.floor(block * 3 / (7 * 24 * 60 * 60));
                  return `Week ${weeks}`;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="totalReleased"
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
              {bucket.vestingSchedule.releaseType === 'NON_LINEAR' && (
                <Line
                  type="monotone"
                  dataKey="weeklyRelease"
                  name="weeklyRelease"
                  stroke="#10b981"
                  strokeWidth={1}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}