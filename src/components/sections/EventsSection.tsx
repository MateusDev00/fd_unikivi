// Server Component – dados via API
import { api } from '@/lib/api';
import { EventCard } from '@/components/home/EventCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export async function EventsSection() {
  let events: any[] = [];
  let total = 0;
  try {
    const res = await api.getEventos(1, 12);
    events = res.data;
    total = res.meta.total;
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Agenda"
          title="Próximos Eventos"
          description="Participe nos nossos seminários, conferências e workshops."
        />

        {events.length === 0 ? (
          <p className="text-center text-body mt-8">
            Nenhum evento recente.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}