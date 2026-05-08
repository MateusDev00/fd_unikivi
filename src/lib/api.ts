import { PaginatedResponse, Publication, Event, Document, UtilizadorCompleto } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T> {
  const headers: HeadersInit = {
    ...(options?.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return res.json();
}

export const api = {
  // ===================== AUTENTICAÇÃO =====================
  login: (bilhete: string, senha: string) =>
    fetchApi<{ success: boolean; data: { token: string; user: UtilizadorCompleto } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ bilhete, senha }),
    }),

  getMe: (token: string) =>
    fetchApi<{ data: UtilizadorCompleto }>('/auth/me', {}, token),

  cadastro: (data: Record<string, any>) =>
    fetchApi<{ success: boolean; data: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ===================== USUÁRIOS (ADMIN) =====================
  getUsuarios: (page = 1, limit = 10, token?: string, filters?: { tipo?: string; search?: string }) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.tipo) params.set('tipo', filters.tipo);
    if (filters?.search) params.set('search', filters.search);
    return fetchApi<PaginatedResponse<UtilizadorCompleto>>(`/usuarios?${params.toString()}`, {}, token);
  },

  createUsuario: (data: Record<string, any>, token: string) =>
    fetchApi<{ success: boolean; data: any }>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  updateUsuario: (id: number, data: Record<string, any>, token: string) =>
    fetchApi<{ success: boolean; message: string }>(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),

  deleteUsuario: (id: number, token: string) =>
    fetchApi<{ success: boolean; message: string }>(`/usuarios/${id}`, { method: 'DELETE' }, token),

  // ===================== PUBLICAÇÕES =====================
  getPublicacoes: (page = 1, limit = 6, token?: string, filters?: { estado?: string; search?: string; dataInicio?: string; dataFim?: string }) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.estado) params.set('estado', filters.estado);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.dataInicio) params.set('data_inicio', filters.dataInicio);
    if (filters?.dataFim) params.set('data_fim', filters.dataFim);
    return fetchApi<PaginatedResponse<Publication>>(`/publicacoes?${params.toString()}`, {}, token);
  },

  createPublicacao: (data: FormData, token: string) =>
    fetchApi<{ success: boolean; data: Publication }>('/publicacoes', {
      method: 'POST',
      body: data,
    }, token),

  updatePublicacao: (id: number, data: FormData, token: string) =>
    fetchApi<{ success: boolean; data: Publication }>(`/publicacoes/${id}`, {
      method: 'PUT',
      body: data,
    }, token),

  deletePublicacao: (id: number, token: string) =>
    fetchApi<{ success: boolean; message: string }>(`/publicacoes/${id}`, { method: 'DELETE' }, token),

  // ===================== EVENTOS =====================
  getEventos: (page = 1, limit = 6, token?: string, filters?: { estado?: string; search?: string; dataInicio?: string; dataFim?: string }) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.estado) params.set('estado', filters.estado);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.dataInicio) params.set('data_inicio', filters.dataInicio);
    if (filters?.dataFim) params.set('data_fim', filters.dataFim);
    return fetchApi<PaginatedResponse<Event>>(`/eventos?${params.toString()}`, {}, token);
  },

  createEvento: (data: FormData, token: string) =>
    fetchApi<{ success: boolean; data: Event }>('/eventos', {
      method: 'POST',
      body: data,
    }, token),

  updateEvento: (id: number, data: FormData, token: string) =>
    fetchApi<{ success: boolean; data: Event }>(`/eventos/${id}`, {
      method: 'PUT',
      body: data,
    }, token),

  deleteEvento: (id: number, token: string) =>
    fetchApi<{ success: boolean; message: string }>(`/eventos/${id}`, { method: 'DELETE' }, token),

  // ===================== DOCUMENTOS =====================
  getDocumentos: (page = 1, limit = 6, token?: string, filters?: { categoria?: string; search?: string; dataInicio?: string; dataFim?: string }) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters?.categoria) params.set('categoria', filters.categoria);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.dataInicio) params.set('data_inicio', filters.dataInicio);
    if (filters?.dataFim) params.set('data_fim', filters.dataFim);
    return fetchApi<PaginatedResponse<Document>>(`/documentos?${params.toString()}`, {}, token);
  },

  createDocumento: (data: FormData, token: string) =>
    fetchApi<{ success: boolean; data: Document }>('/documentos', {
      method: 'POST',
      body: data,
    }, token),

  updateDocumento: (id: number, data: FormData, token: string) =>
    fetchApi<{ success: boolean; data: Document }>(`/documentos/${id}`, {
      method: 'PUT',
      body: data,
    }, token),

  deleteDocumento: (id: number, token: string) =>
    fetchApi<{ success: boolean; message: string }>(`/documentos/${id}`, { method: 'DELETE' }, token),

  // ===================== UPLOADS =====================
  uploadFile: (file: File, folder: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<{ path: string }>(`/upload/${folder}`, {
      method: 'POST',
      body: formData,
    }, token);
  },
};