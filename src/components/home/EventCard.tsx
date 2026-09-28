'use client';

import { Event } from '@/types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ImageModal } from '@/components/ui/ImageModal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

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
  const temImagem = event.imagem_capa && event.imagem_capa.trim().length > 0;

  return (
    <>
      {/* ───── Card com efeito 3D ───── */}
      <CardContainer className="w-full py-0">
        <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-full h-auto rounded-xl p-0 border shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          
          {/* Imagem clicável – agora com profundidade 3D */}
          {temImagem && (
            <CardItem
              translateZ="50"
              className="w-full cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            >
              <div className="relative h-40 w-full">
                <Image
                  src={event.imagem_capa!}
                  alt={event.titulo}
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-dark/0 group-hover/card:bg-dark/10 transition-colors" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isPast ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white'
                    }`}
                  >
                    {isPast ? 'Realizado' : 'Futuro'}
                  </span>
                </div>
              </div>
            </CardItem>
          )}

          {/* Conteúdo do cartão com itens em profundidade */}
          <div className="p-5">
            <CardItem translateZ="40" className="font-serif text-lg text-heading mb-2 line-clamp-2">
              {event.titulo}
            </CardItem>

            <div className="space-y-2 mb-4">
              <CardItem translateZ="20" className="text-sm text-body flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {formatDate(event.data_evento)}
              </CardItem>
              {event.local && (
                <CardItem translateZ="20" className="text-sm text-body flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {event.local}
                </CardItem>
              )}
            </div>

            <CardItem translateZ="30">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center text-primary font-medium text-sm hover:underline"
              >
                Ver detalhes
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {/* ───── Lightbox da imagem ───── */}
      {isImageOpen && temImagem && (
        <ImageModal
          src={event.imagem_capa!}
          alt={event.titulo}
          onClose={() => setIsImageOpen(false)}
        />
      )}

      {/* ───── Modal de detalhes ───── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={event.titulo}
      >
        {temImagem && (
          <div
            className="relative h-56 w-full mb-6 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setIsModalOpen(false);
              setIsImageOpen(true);
            }}
          >
            <Image
              src={event.imagem_capa!}
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