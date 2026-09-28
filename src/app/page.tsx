import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import PublicationsSection from '@/components/sections/PublicationsSection';
import EventsSection from '@/components/sections/EventsSection';
import DocumentsSection from '@/components/sections/DocumentsSection';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <PublicationsSection />
        <EventsSection />
        <DocumentsSection />
        
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}