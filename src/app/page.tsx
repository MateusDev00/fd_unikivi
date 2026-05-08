import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PublicationsSection } from '@/components/sections/PublicationsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { DocumentsSection } from '@/components/sections/DocumentsSection';
import { NewsletterBanner } from '@/components/sections/NewsletterBanner';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        {/* As sections abaixo são server components que buscam dados da API */}
        <PublicationsSection />
        <EventsSection />
        <DocumentsSection />
        <NewsletterBanner />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}