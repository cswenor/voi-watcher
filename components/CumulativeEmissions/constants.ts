export const COLORS = {
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
  } as const;
  
  export const TOTAL_WEEKS = 1040; // 20 years
  export const WEEKS_PER_YEAR = 52;
  
  export const SIGNIFICANT_YEARS = [5, 10, 15, 20] as const;
  export const Y_AXIS_TICKS = [2500000000, 5000000000, 7500000000, 10000000000];
  export const Y_AXIS_DOMAIN: [number, number] = [0, 10000000000];