import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MediaGallerySection from '@/components/MediaGallerySection';
import LocalGallerySection from '@/components/LocalGallerySection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main>
        <HeroSection />
        <MediaGallerySection />
        <LocalGallerySection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
