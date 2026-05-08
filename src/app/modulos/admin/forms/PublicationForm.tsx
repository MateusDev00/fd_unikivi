'use client';

import { useState, useEffect, useRef } from 'react';
import { Publication } from '@/types';
import { Button } from '@/components/ui/Button';
import { X, Upload } from 'lucide-react';

interface PublicationFormProps {
  initialData?: Publication | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

export function PublicationForm({ initialData, onClose, onSave }: PublicationFormProps) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [conteudo, setConteudo] = useState(initialData?.conteudo || '');
  const [imagem, setImagem] = useState<File | null>(null);
  const [estado, setEstado] = useState(initialData?.estado || 'rascunho');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    formData.append('estado', estado);
    if (imagem) formData.append('imagem_capa', imagem);
    if (initialData) {
      formData.append('_method', 'PUT'); // se a API usar method spoofing
    }
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-2xl text-heading">
            {initialData ? 'Editar Publicação' : 'Nova Publicação'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Conteúdo</label>
            <textarea
              rows={8}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setEstado(e.target.value as typeof estado)
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Imagem de Capa</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-body hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                {imagem ? imagem.name : 'Escolher ficheiro'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImagem(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}