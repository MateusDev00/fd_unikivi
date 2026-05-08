'use client';

import { useState } from 'react';
import { EventCard } from '@/components/home/EventCard';
import { Pagination } from '@/components/ui/Pagination';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Event, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';

interface EventsClientProps {
  initialData: PaginatedResponse<Event>;
}

export function PaginatedEvents({ initialData }: EventsClientProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    try {
      const newData = await api.getEventos(page, 3);
      setData(newData);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Agenda"
          title="Próximos Eventos"
          description="Participe nos nossos seminários, conferências e workshops."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 h-64 animate-pulse" />
            ))
          ) : data.data.length > 0 ? (
            data.data.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="col-span-full text-center text-body">
              Nenhum evento encontrado.
            </p>
          )}
        </div>

        {data.meta.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}