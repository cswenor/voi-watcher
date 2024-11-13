export interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: number;
    timestamp: number;
    type: string;
  }
  
  export interface Wallet {
    address: string;
    name: string;
    type: 'vesting' | 'lockup' | 'treasury';
    rules: {
      vestingSchedule?: {
        startDate: number;
        endDate: number;
        totalAmount: number;
      };
      lockupPeriod?: {
        until: number;
      };
    };
  }