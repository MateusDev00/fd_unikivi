'use client';

import { Publication } from '@/types';
import { Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ImageModal } from '@/components/ui/ImageModal';
import Image from 'next/image';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const temImagem = publication.imagem_capa && publication.imagem_capa.trim().length > 0;

  return (
    <>
      {/* Cartão principal */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Imagem clicável → abre lightbox */}
        {temImagem && (
          <div
            className="relative h-48 w-full cursor-pointer group"
            onClick={() => setIsImageOpen(true)}
          >
            <Image
              src={publication.imagem_capa!}
              alt={publication.titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay suave no hover */}
            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors" />
          </div>
        )}

        {/* Corpo do cartão */}
        <div className="p-6">
          <div className="flex items-center text-sm text-body mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(publication.criado_em)}
          </div>
          <h3 className="font-serif text-xl text-heading mb-3 line-clamp-2">
            {publication.titulo}
          </h3>
          <p className="text-body mb-4 line-clamp-3">
            {publication.conteudo?.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
          {/* Botão que abre o modal de detalhes */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Ler mais
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lightbox da imagem (abre ao clicar na imagem do cartão) */}
      {isImageOpen && temImagem && (
        <ImageModal
          src={publication.imagem_capa!}
          alt={publication.titulo}
          onClose={() => setIsImageOpen(false)}
        />
      )}

      {/* Modal de detalhes (abre ao clicar em "Ler mais") */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={publication.titulo}
      >
        {/* Imagem dentro do modal também é clicável e abre o lightbox */}
        {temImagem && (
          <div
            className="relative h-64 w-full mb-6 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setIsModalOpen(false);
              setIsImageOpen(true);
            }}
          >
            <Image
              src={publication.imagem_capa!}
              alt={publication.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}
        {/* Conteúdo textual da publicação */}
        <div className="prose prose-headings:font-serif prose-headings:text-heading max-w-none">
          <div dangerouslySetInnerHTML={{ __html: publication.conteudo }} />
        </div>
        <p className="text-sm text-body mt-4">
          Publicado em {formatDate(publication.criado_em)}
        </p>
      </Modal>
    </>
  );
}