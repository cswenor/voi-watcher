import { fetchSupplyData } from '@/lib/supply-service';
import { FormattedVOI } from '@/components/FormattedNumber';
import { TokenBucket, BucketCategory } from '@/types/supply';
import { EmissionsModal } from '@/components/EmissionsModal';

// Helper to calculate months from blocks (3 second blocks)
const blocksToReadable = (blocks: number): string => {
  const months = Math.floor((blocks * 3) / (30 * 24 * 60 * 60));
  if (months >= 12) {
    return `${(months / 12).toFixed(1)} years`;
  }
  return `${months} months`;
};

// Helper to group buckets by category and subcategory
const groupBuckets = (buckets: TokenBucket[]) => {
  const groups: Record<BucketCategory, {
    treasury?: TokenBucket[],
    core?: TokenBucket[],
    other?: TokenBucket[]
  }> = {
    'Community': { other: [] },
    'Block Authority': {
      treasury: [],
      core: [],
    },
    'Investors': { other: [] }
  };
  
  buckets.forEach(bucket => {
    if (bucket.category === 'Block Authority') {
      if (bucket.id.startsWith('TREASURY')) {
        groups['Block Authority'].treasury?.push(bucket);
      } else {
        groups['Block Authority'].core?.push(bucket);
      }
    } else {
      groups[bucket.category].other?.push(bucket);
    }
  });
  
  return groups;
};

export default async function Page() {
  const data = await fetchSupplyData();
  const groupedBuckets = groupBuckets(data.buckets);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      {/* Current Block Display */}
      <div className="fixed top-4 right-4 bg-white shadow rounded-full px-4 py-2 text-sm font-medium">
        Current Block: {data.currentBlock.toLocaleString()}
      </div>

      {/* Supply Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Supply</h2>
          <div className="text-3xl font-bold mt-2">
            <FormattedVOI amount={data.totalSupply} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Distributed Supply</h2>
          <div className="text-3xl font-bold mt-2">
            <FormattedVOI amount={data.distributedSupply} />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((Number(data.distributedSupply) * 100) / Number(data.totalSupply)).toFixed(2)}% of Total Supply
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Available Supply</h2>
          <div className="text-3xl font-bold mt-2">
            <FormattedVOI amount={data.availableSupply} />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((Number(data.availableSupply) * 100) / Number(data.totalSupply)).toFixed(2)}% of Total Supply
          </div>
        </div>
      </div>

      {/* Buckets By Category */}
      <div className="space-y-12">
        {(Object.entries(groupedBuckets) as [BucketCategory, typeof groupedBuckets[BucketCategory]][]).map(([category, subgroups]) => {
          const summary = data.categorySummaries[category];
          
          return (
            <div key={category} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{category}</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Total: <FormattedVOI amount={summary.totalAmount} />
                  </div>
                  <div className="text-sm text-gray-600">
                    {summary.percentage.toFixed(2)}% of Total Supply
                  </div>
                  <div className="text-sm text-gray-600">
                    Available: <FormattedVOI amount={summary.availableAmount} />
                  </div>
                </div>
              </div>

              {/* Render subgroups for Block Authority */}
              {category === 'Block Authority' ? (
                <div className="space-y-8">
                  {/* Treasury Section */}
                  {subgroups.treasury && subgroups.treasury.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">Treasury</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {subgroups.treasury.map(renderBucket)}
                      </div>
                    </div>
                  )}
                  
                  {/* Core Team Section */}
                  {subgroups.core && subgroups.core.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">Core Team</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {subgroups.core.map(renderBucket)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Regular category display
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {subgroups.other?.map(renderBucket)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

// Helper function to render individual bucket cards
const renderBucket = (bucket: TokenBucket) => (
  <div key={bucket.id} 
       className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold">{bucket.name}</h3>
        <div className="text-sm text-gray-500">{bucket.percentage}% of Total Supply</div>
      </div>
      <div className={`w-3 h-3 rounded-full ${bucket.isCompliant ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
    
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="font-semibold">
            <FormattedVOI amount={bucket.totalAmount} />
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Available</div>
          <div className="font-semibold">
            <FormattedVOI amount={bucket.availableAmount} />
          </div>
        </div>
      </div>
      
      <div>
        <div className="text-sm text-gray-600">Lock Period</div>
        <div className="font-semibold">
          {bucket.lockupBlocks === 0 ? (
            'No lockup'
          ) : (
            <>
              {blocksToReadable(bucket.lockupBlocks)}
              <span className="text-xs text-gray-500 ml-2">
                ({bucket.lockupBlocks.toLocaleString()} blocks)
              </span>
            </>
          )}
        </div>
      </div>
      
      <div>
        <div className="text-sm text-gray-600">Vesting</div>
        <div className="font-semibold">
          {bucket.vestingSchedule.releaseType === 'NON_LINEAR' ? (
            <div className="text-sm">
              <div>Non-linear release over {blocksToReadable(bucket.vestingSchedule.endBlock)}</div>
              <div className="text-xs text-gray-500">{bucket.vestingSchedule.formula}</div>
            </div>
          ) : (
            <div>
              {bucket.vestingSchedule.startBlock === bucket.vestingSchedule.endBlock ? (
                'Immediate after lock'
              ) : (
                `Linear over ${blocksToReadable(bucket.vestingSchedule.endBlock - bucket.vestingSchedule.startBlock)}`
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <EmissionsModal bucket={bucket} />
      </div>
    </div>
  </div>
);

export const runtime = 'edge';