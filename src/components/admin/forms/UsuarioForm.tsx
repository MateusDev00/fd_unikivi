'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface UsuarioFormProps {
  initialData?: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function UsuarioForm({ initialData, onClose, onSave }: UsuarioFormProps) {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [bilhete, setBilhete] = useState(initialData?.bilhete || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState(initialData?.tipo || 'estudante');
  const [saving, setSaving] = useState(false);

  // Campos específicos
  const [numeroEstudante, setNumeroEstudante] = useState(initialData?.numero_estudante || '');
  const [curso, setCurso] = useState(initialData?.curso || '');
  const [anoIngresso, setAnoIngresso] = useState(initialData?.ano_ingresso || '');
  const [departamento, setDepartamento] = useState(initialData?.departamento || '');
  const [titulacao, setTitulacao] = useState(initialData?.titulacao || '');
  const [areaEspecializacao, setAreaEspecializacao] = useState(initialData?.area_especializacao || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = { nome, bilhete, email, tipo };
    if (!initialData || senha) payload.senha = senha;
    if (tipo === 'estudante') {
      payload.numero_estudante = numeroEstudante;
      payload.curso = curso;
      payload.ano_ingresso = parseInt(anoIngresso, 10);
    } else if (tipo === 'docente') {
      payload.departamento = departamento;
      payload.titulacao = titulacao;
      payload.area_especializacao = areaEspecializacao;
    }
    await onSave(payload);
    setSaving(false);
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-2xl text-heading">
            {isEditing ? 'Editar Utilizador' : 'Novo Utilizador'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Nome</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Nº do Bilhete</label>
              <input type="text" value={bilhete} onChange={e => setBilhete(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                {isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
              </label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required={!isEditing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="estudante">Estudante</option>
                <option value="docente">Docente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {tipo === 'estudante' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Nº Estudante</label>
                <input type="text" value={numeroEstudante} onChange={e => setNumeroEstudante(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Curso</label>
                <input type="text" value={curso} onChange={e => setCurso(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Ano Ingresso</label>
                <input type="number" value={anoIngresso} onChange={e => setAnoIngresso(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
            </div>
          )}

          {tipo === 'docente' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Departamento</label>
                <input type="text" value={departamento} onChange={e => setDepartamento(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Titulação</label>
                <input type="text" value={titulacao} onChange={e => setTitulacao(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1">Área Especialização</label>
                <input type="text" value={areaEspecializacao} onChange={e => setAreaEspecializacao(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}