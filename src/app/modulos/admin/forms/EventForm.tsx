'use client';

import { useState, useRef } from 'react';
import { Event } from '@/types';
import { Button } from '@/components/ui/Button';
import { X, Upload, Calendar } from 'lucide-react';

interface EventFormProps {
  initialData?: Event | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function EventForm({ initialData, onClose, onSave }: EventFormProps) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [dataEvento, setDataEvento] = useState(
    initialData?.data_evento ? new Date(initialData.data_evento).toISOString().slice(0, 16) : ''
  );
  const [local, setLocal] = useState(initialData?.local || '');
  const [estado, setEstado] = useState(initialData?.estado || 'futuro');
  const [imagem, setImagem] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      titulo,
      descricao,
      data_evento: new Date(dataEvento).toISOString(),
      local,
      estado,
      imagem_capa: imagem ? imagem : undefined, // a API tratará o upload se houver imagem
    };

    // Se houver imagem, seria melhor usar FormData, mas para simplificar, vamos assumir que a API aceita Base64 ou após
    // Idealmente, a API de criação de eventos aceita imagem no mesmo padrão de multipart. Vamos manter consistência com o backend.
    // Para já, passaremos como objeto JSON (a imagem pode ser enviada separadamente se necessário)
    // Alternativa robusta: usar FormData sempre. Vamos refinar:

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('data_evento', new Date(dataEvento).toISOString());
    formData.append('local', local);
    formData.append('estado', estado);
    if (imagem) formData.append('imagem', imagem);

    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-2xl text-heading">
            {initialData ? 'Editar Evento' : 'Novo Evento'}
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
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Data e Hora</label>
              <input
                type="datetime-local"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Local</label>
              <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
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
                <option value="futuro">Futuro</option>
                <option value="realizado">Realizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Cartaz (imagem)</label>
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