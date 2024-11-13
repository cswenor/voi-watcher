interface BlockCounterProps {
    currentBlock: number;
  }
  
  export function BlockCounter({ currentBlock }: BlockCounterProps) {
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium border">
        Current Block: {currentBlock.toLocaleString()}
      </div>
    );
  }