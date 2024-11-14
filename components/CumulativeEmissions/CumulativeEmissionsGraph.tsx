"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CumulativeEmissionsGraphProps } from './types';
import { COLORS, WEEKS_PER_YEAR, SIGNIFICANT_YEARS, Y_AXIS_TICKS, Y_AXIS_DOMAIN, TOTAL_WEEKS } from './constants';
import { calculateEmissionsData } from './calculations';

export function CumulativeEmissionsGraph({ buckets, totalSupply }: CumulativeEmissionsGraphProps) {
  const data = calculateEmissionsData(buckets, totalSupply);
  
  // Pre-calculate the tick positions
  const xAxisTicks = SIGNIFICANT_YEARS.map(year => year * WEEKS_PER_YEAR);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-12">
      <h2 className="text-2xl font-bold mb-6">Cumulative Token Emissions</h2>
      <div className="h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            {buckets.map((bucket) => (
              <defs key={bucket.name}>
                <linearGradient id={bucket.name.replace(/\s+/g, '-').toLowerCase()} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS[bucket.name as keyof typeof COLORS]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS[bucket.name as keyof typeof COLORS]}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
            ))}
            
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            
            <XAxis
              dataKey="week"
              axisLine={{ stroke: '#666' }}
              tickLine={true}
              ticks={xAxisTicks}
              tickFormatter={(week) => `Year ${week / WEEKS_PER_YEAR}`}
              interval={0}
              tick={{ fontSize: 12, fill: '#666' }}
              type="number"
              domain={[0, TOTAL_WEEKS]}
              padding={{ left: 0, right: 0 }}
            />
            
            <YAxis
              tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
              ticks={Y_AXIS_TICKS}
              domain={Y_AXIS_DOMAIN}
              axisLine={{ stroke: '#666' }}
              tickLine={true}
              tick={{ fontSize: 12 }}
              width={60}
            />
            
            <Tooltip
              formatter={(value: number, name: string) => [
                `${(value / 1_000_000).toFixed(2)}M VOI (${((value / Number(totalSupply)) * 1e9 * 100).toFixed(2)}%)`,
                name
              ]}
              labelFormatter={(week) => {
                const year = Math.floor(week / WEEKS_PER_YEAR);
                const weekOfYear = week % WEEKS_PER_YEAR;
                return `Year ${year}, Week ${weekOfYear}`;
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '6px',
                border: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0'
              }}
            />
            
            {buckets.map((bucket) => (
              <Area
                key={bucket.name}
                type="monotone"
                dataKey={bucket.name}
                stackId="1"
                stroke={COLORS[bucket.name as keyof typeof COLORS]}
                fill={`url(#${bucket.name.replace(/\s+/g, '-').toLowerCase()})`}
                fillOpacity={1}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}