'use client';

import { useState, useRef } from 'react';
import { Document } from '@/types';
import { Button } from '@/components/ui/Button';
import { X, Upload } from 'lucide-react';

interface DocumentFormProps {
  initialData?: Document | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

export function DocumentForm({ initialData, onClose, onSave }: DocumentFormProps) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [categoria, setCategoria] = useState(initialData?.categoria || '');
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !ficheiro) {
      alert('Selecione um ficheiro para upload.');
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (descricao) formData.append('descricao', descricao);
    if (categoria) formData.append('categoria', categoria);
    if (ficheiro) formData.append('documento', ficheiro);

    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-2xl text-heading">
            {isEditing ? 'Editar Metadados' : 'Novo Documento'}
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
            <label className="block text-sm font-medium text-heading mb-1">Descrição</label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Categoria</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Ex: legislação, artigo_cientifico"
            />
          </div>
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Ficheiro (PDF, DOCX, etc.)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-body hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                {ficheiro ? ficheiro.name : 'Selecionar ficheiro'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                className="hidden"
                onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
              />
              {ficheiro && (
                <p className="text-xs text-body mt-1">
                  {(ficheiro.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          )}
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