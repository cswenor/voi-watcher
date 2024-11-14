import { TokenBucket } from '@/types/supply';

export interface CumulativeEmissionsGraphProps {
  buckets: TokenBucket[];
  totalSupply: bigint;
}

export interface EmissionPoint {
  week: number;
  totalEmitted: number;
  [key: string]: number;
}

export interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: number;
  };
}