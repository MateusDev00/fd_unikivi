'use client';

import { Event } from '@/types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPast = new Date(event.data_evento) < new Date();

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {event.imagem_capa && (
          <div className="relative h-40 w-full">
            <Image
              src={event.imagem_capa}
              alt={event.titulo}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isPast ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white'
              }`}>
                {isPast ? 'Realizado' : 'Futuro'}
              </span>
            </div>
          </div>
        )}
        <div className="p-5">
          <h3 className="font-serif text-lg text-heading mb-2 line-clamp-2">
            {event.titulo}
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-body">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              {formatDate(event.data_evento)}
            </div>
            {event.local && (
              <div className="flex items-center text-sm text-body">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {event.local}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center text-primary font-medium text-sm hover:underline"
          >
            Ver detalhes
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={event.titulo}
      >
        {event.imagem_capa && (
          <div className="relative h-56 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={event.imagem_capa}
              alt={event.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-heading">Data e Hora</p>
              <p className="text-body">{formatDate(event.data_evento)}</p>
            </div>
          </div>
          {event.local && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-heading">Local</p>
                <p className="text-body">{event.local}</p>
              </div>
            </div>
          )}
        </div>
        {event.descricao && (
          <div className="prose max-w-none">
            <p className="text-body">{event.descricao}</p>
          </div>
        )}
      </Modal>
    </>
  );
}