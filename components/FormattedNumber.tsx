export function formatVOI(amount: bigint): string {
    const amountStr = amount.toString();
    const wholePart = amountStr.slice(0, -9) || '0';
    const fractionalPart = amountStr.slice(-9).padStart(9, '0');
    
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedWhole}.${fractionalPart.slice(0, 2)} VOI`;
  }
  
  export function formatBlocks(blocks: number): string {
    return blocks.toLocaleString();
  }
  
  export function FormattedVOI({ amount }: { amount: bigint }) {
    return <span className="font-mono">{formatVOI(amount)}</span>;
  }