import { TokenBucket } from '@/types/supply';
import { FormattedVOI } from './FormattedNumber';
import { EmissionsModal } from './EmissionsModal';
import { blocksToReadable } from '@/lib/utils';

interface BucketCardProps {
  bucket: TokenBucket;
}

export function BucketCard({ bucket }: BucketCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
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
}