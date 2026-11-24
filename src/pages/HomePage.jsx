import { HeroSection } from '../components/HeroSection.jsx';
import { HistorySection } from '../components/HistorySection.jsx';
import { CollectionsSection } from '../components/CollectionsSection.jsx';
import { FeaturedSection } from '../components/FeaturedSection.jsx';
import { CatalogSection } from '../components/CatalogSection.jsx';
import { StoresSection } from '../components/StoresSection.jsx';
import { CreatorSection } from '../components/CreatorSection.jsx';
import { DeliveryInfo } from '../components/DeliveryInfo.jsx';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HistorySection />
      <CollectionsSection />
      <FeaturedSection />
      <CatalogSection />
      <StoresSection />
      <CreatorSection />
      <DeliveryInfo />
    </>
  );
}
