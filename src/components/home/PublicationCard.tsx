'use client';

import { Publication } from '@/types';
import { Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Image from 'next/image';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {publication.imagem_capa && (
          <div className="relative h-48 w-full">
            <Image
              src={publication.imagem_capa}
              alt={publication.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-body mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(publication.criado_em)}
          </div>
          <h3 className="font-serif text-xl text-heading mb-3 line-clamp-2">
            {publication.titulo}
          </h3>
          <p className="text-body mb-4 line-clamp-3">
            {/* Aqui podemos usar um resumo, mas como não temos campo resumo, usamos os primeiros caracteres */}
            {publication.conteudo.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Ler mais
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={publication.titulo}
      >
        {publication.imagem_capa && (
          <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={publication.imagem_capa}
              alt={publication.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}
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