'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EventCard } from '@/components/home/EventCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function EventsSection() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEventos(1, 12)
      .then(res => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Agenda"
          title="Próximos Eventos"
          description="Participe nos nossos seminários, conferências e workshops."
        />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-body mt-8">Nenhum evento recente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}