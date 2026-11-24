import { HeroSection } from '../components/HeroSection.jsx';
import { CatalogSection } from '../components/CatalogSection.jsx';
import { StoresSection } from '../components/StoresSection.jsx';
import { CreatorSection } from '../components/CreatorSection.jsx';
import { DeliveryInfo } from '../components/DeliveryInfo.jsx';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CatalogSection />
      <StoresSection />
      <CreatorSection />
      <DeliveryInfo />
    </>
  );
}
