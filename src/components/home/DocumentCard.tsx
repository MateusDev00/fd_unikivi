'use client';

import { Document } from '@/types';
import { FileText, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  };

  const handleDownload = () => {
    window.open(`/api/documentos/${document.id}/download`, '_blank');
  };

  return (
    <>
      <CardContainer className="w-full py-0">
        <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-full h-auto rounded-xl p-6 border shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <CardItem translateZ="40" className="bg-primary-light p-3 rounded-xl">
              <FileText className="h-6 w-6 text-primary" />
            </CardItem>
            <CardItem translateZ="30" className="flex-1 min-w-0">
              <h3 className="font-serif text-lg text-heading mb-1 line-clamp-2">
                {document.titulo}
              </h3>
              <p className="text-sm text-body mb-1">{formatFileSize(document.tamanho_bytes)}</p>
              {document.categoria && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {document.categoria}
                </span>
              )}
            </CardItem>
          </div>

          {document.descricao && (
            <CardItem translateZ="20" className="mt-4">
              <p className="text-body text-sm line-clamp-3">{document.descricao}</p>
            </CardItem>
          )}

          <CardItem translateZ="30" className="mt-4 flex items-center justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary hover:text-primary/80 p-1"
              aria-label="Visualizar detalhes"
            >
              <Eye className="h-5 w-5" />
            </button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </CardItem>
        </CardBody>
      </CardContainer>

      {/* Modal de detalhes (sem 3D, mantido igual) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={document.titulo}>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-body">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            <span>{document.nome_original}</span>
          </div>
          <div className="flex items-center text-sm text-body">
            <span className="font-medium mr-2">Tamanho:</span>
            {formatFileSize(document.tamanho_bytes)}
          </div>
          {document.categoria && (
            <div className="flex items-center text-sm text-body">
              <span className="font-medium mr-2">Categoria:</span>
              {document.categoria}
            </div>
          )}
          {document.descricao && (
            <div>
              <h4 className="font-serif text-heading mb-2">Descrição</h4>
              <p className="text-body">{document.descricao}</p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}