'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion } from 'framer-motion';

type BiografiaForm = {
  biografia: string;
  foto: string;
  website: string;
  redes_sociais: Record<string, string>;
};

export default function BiografiaPage() {
  const { user, token } = useAuth();
  const [form, setForm] = useState<BiografiaForm>({
    biografia: '',
    foto: '',
    website: '',
    redes_sociais: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || !token) return;
    const fetchBio = async () => {
      try {
        const res = await fetch(`/api/docentes/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setForm({
              biografia: data.data.biografia || '',
              foto: data.data.foto || '',
              website: data.data.website || '',
              redes_sociais: data.data.redes_sociais || {},
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBio();
  }, [user, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch(`/api/docentes/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LawLoader />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-heading">Minha Biografia</h1>
        <p className="text-body mt-1">Edite a sua biografia pública e informações profissionais.</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Foto URL</label>
            <input
              type="url"
              value={form.foto}
              onChange={(e) => setForm({ ...form, foto: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Biografia</label>
            <textarea
              rows={8}
              value={form.biografia}
              onChange={(e) => setForm({ ...form, biografia: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Conte a sua história académica e profissional..."
            />
          </div>
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Biografia atualizada com sucesso!
            </div>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </form>
      </div>
    </div>
  );
}