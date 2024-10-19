import HeroSection from './Homepage/HeroSection';

import ProductGrid from './Homepage/ProductGrid';

import PurchaseSection from './Homepage/PurchaseSection';

import ReasonsList from './Homepage/ReasonsList';

import ReviewsSection from './Homepage/ReviewsSection';

export default function Home() {

  return (
    <div>
      <HeroSection />
      <ReasonsList />
      <PurchaseSection />
      <ProductGrid />
      <ReviewsSection />
    </div>
  );
}

