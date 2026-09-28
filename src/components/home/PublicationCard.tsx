'use client';

import { Publication } from '@/types';
import { Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ImageModal } from '@/components/ui/ImageModal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import Image from 'next/image';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const temImagem = publication.imagem_capa && publication.imagem_capa.trim().length > 0;

  return (
    <>
      <CardContainer className="w-full py-0">
        <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-full h-auto rounded-xl p-0 border shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          {temImagem && (
            <CardItem translateZ="50" className="w-full cursor-pointer" onClick={() => setIsImageOpen(true)}>
              <div className="relative h-48 w-full">
                <Image
                  src={publication.imagem_capa!}
                  alt={publication.titulo}
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-dark/0 group-hover/card:bg-dark/10 transition-colors" />
              </div>
            </CardItem>
          )}

          <div className="p-6">
            <CardItem translateZ="20" className="text-sm text-body mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(publication.criado_em)}
            </CardItem>
            <CardItem translateZ="40" className="font-serif text-xl text-heading mb-3 line-clamp-2">
              {publication.titulo}
            </CardItem>
            <CardItem translateZ="20" className="text-body mb-4 line-clamp-3">
              {publication.conteudo?.replace(/<[^>]*>/g, '').substring(0, 120)}...
            </CardItem>
            <CardItem translateZ="30">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Ler mais
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {isImageOpen && temImagem && (
        <ImageModal
          src={publication.imagem_capa!}
          alt={publication.titulo}
          onClose={() => setIsImageOpen(false)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={publication.titulo}
      >
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