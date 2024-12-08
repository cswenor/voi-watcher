import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Bottleneck from 'bottleneck';

interface WalletBalance {
  address: string;
  balance: number; // Balance in VOI
  lastUpdated: number;
}

interface WalletBalanceState {
  balances: Record<string, WalletBalance>;
  isLoading: boolean;
  error: string | null;
}

interface WalletBalanceStore extends WalletBalanceState {
  fetchBalance: (address: string) => Promise<void>;
  fetchBalances: (addresses: string[]) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const VOI_DECIMALS = 6;

// Create a limiter for API calls
const limiter = new Bottleneck({
  minTime: 100, // Minimum time between requests
  maxConcurrent: 1, // Only process one request at a time
});

export const useWalletBalances = create<WalletBalanceStore>()(
  devtools((set, get) => ({
    balances: {},
    isLoading: false,
    error: null,

    fetchBalance: limiter.wrap(async (address: string) => {
      const { balances } = get();
      const now = Date.now();

      // Use cached balance if it's still valid
      if (
        balances[address] &&
        now - balances[address].lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`/api/account?address=${address}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch balance');
        }

        const accountInfo = await response.json();
        const balance = Number(accountInfo.amount) / Math.pow(10, VOI_DECIMALS);

        set((state) => ({
          balances: {
            ...state.balances,
            [address]: {
              address,
              balance,
              lastUpdated: now,
            },
          },
          isLoading: false,
        }));
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to fetch balance',
          isLoading: false,
        });
      }
    }),

    async fetchBalances(addresses: string[]) {
      const uniqueAddresses = [...new Set(addresses)];
      await Promise.all(
        uniqueAddresses.map((address) => get().fetchBalance(address))
      );
    },
  }))
);
