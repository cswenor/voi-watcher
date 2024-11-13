import { TokenBucket, CategorySummary } from '@/types/supply';
import { FormattedVOI } from './FormattedNumber';
import { BucketCard } from './BucketCard';

interface CategorySectionProps {
  title: string;
  buckets: TokenBucket[];
  summary: CategorySummary;
  subCategories?: {
    title: string;
    buckets: TokenBucket[];
  }[];
}

export function CategorySection({ title, buckets, summary, subCategories }: CategorySectionProps) {
  const totalPercentage = buckets.reduce((sum, bucket) => sum + bucket.percentage, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Total: <FormattedVOI amount={summary.totalAmount} />
          </div>
          <div className="text-sm text-gray-600">
            {totalPercentage.toFixed(2)}% of Total Supply
          </div>
          <div className="text-sm text-gray-600">
            Available: <FormattedVOI amount={summary.availableAmount} />
          </div>
        </div>
      </div>

      {subCategories ? (
        <div className="space-y-8">
          {subCategories.map((subCategory) => (
            <div key={subCategory.title}>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">{subCategory.title}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {subCategory.buckets.map((bucket) => (
                  <BucketCard key={bucket.id} bucket={bucket} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {buckets.map((bucket) => (
            <BucketCard key={bucket.id} bucket={bucket} />
          ))}
        </div>
      )}
    </div>
  );
}