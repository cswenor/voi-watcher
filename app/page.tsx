import { fetchSupplyData } from '@/lib/supply-service';
import { groupBuckets } from '@/lib/utils';
import { Header } from '@/components/Header';
import { WarningBanner } from '@/components/WarningBanner';
import { SupplyOverview } from '@/components/SupplyOverview';
import { CategorySection } from '@/components/CategorySection';
import { BlockCounter } from '@/components/BlockCounter';
import { BucketCategory } from '@/types/supply';
import { CumulativeEmissionsGraph } from '@/components/CumulativeEmissions';

export default async function Page() {
  const data = await fetchSupplyData();
  const groupedBuckets = groupBuckets(data.buckets);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WarningBanner />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative pb-16">
        <SupplyOverview 
          totalSupply={data.totalSupply}
          distributedSupply={data.distributedSupply}
          availableSupply={data.availableSupply}
        />

        <div className="space-y-12">
          {(Object.entries(groupedBuckets) as [BucketCategory, typeof groupedBuckets[BucketCategory]][]).map(([category, subgroups]) => {
            if (category === 'Block Authority') {
              return (
                <CategorySection
                  key={category}
                  title={category}
                  buckets={[...(subgroups.treasury || []), ...(subgroups.core || [])]}
                  summary={data.categorySummaries[category]}
                  subCategories={[
                    { title: 'Treasury', buckets: subgroups.treasury || [] },
                    { title: 'Core Team', buckets: subgroups.core || [] }
                  ]}
                />
              );
            }

            return (
              <CategorySection
                key={category}
                title={category}
                buckets={subgroups.other || []}
                summary={data.categorySummaries[category]}
              />
            );
          })}
        </div>

        <CumulativeEmissionsGraph 
          buckets={data.buckets}
          totalSupply={data.totalSupply}
        />

        <BlockCounter currentBlock={data.currentBlock} />
      </main>
    </div>
  );
}