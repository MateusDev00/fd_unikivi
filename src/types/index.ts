// Tipos baseados no esquema da base de dados (português)
export type TipoUtilizador = 'admin' | 'estudante' | 'docente';
export type EstadoPublicacao = 'rascunho' | 'publicado' | 'arquivado';
export type EstadoEvento = 'futuro' | 'realizado' | 'cancelado';

export interface Utilizador {
  id: number;
  nome: string;
  bilhete: string;
  email: string | null;
  senha_hash: string;
  tipo: TipoUtilizador;
  email_verificado: boolean;
  data_ultimo_acesso: Date | null;
  criado_em: Date;
  atualizado_em: Date;
  eliminado_em: Date | null;
}

export interface Estudante {
  id_utilizador: number;
  numero_estudante: string;
  curso: string;
  ano_ingresso: number;
  criado_em: Date;
  atualizado_em: Date;
  eliminado_em: Date | null;
}

export interface Docente {
  id_utilizador: number;
  departamento: string;
  titulacao: string;
  area_especializacao: string | null;
  criado_em: Date;
  atualizado_em: Date;
  eliminado_em: Date | null;
}

export interface UtilizadorCompleto {
  id: number;
  nome: string;
  bilhete: string;
  email?: string | null;
  tipo: TipoUtilizador;
  criado_em?: string;
  // opcional – a resposta da API pode incluir estes campos
  email_verificado?: boolean;
  data_ultimo_acesso?: string;
  estudante?: Estudante | null;
  docente?: Docente | null;
}

export interface Publication {
  id: number;
  titulo: string;
  slug: string;
  conteudo: string;
  imagem_capa: string | null;
  estado: EstadoPublicacao;
  criado_por?: number;
  criado_em: string;
  atualizado_em: string;
  eliminado_em?: string | null;
}

export interface Event {
  id: number;
  titulo: string;
  slug: string;
  descricao: string | null;
  data_evento: string;
  estado: EstadoEvento;
  local: string | null;
  imagem_capa: string | null;
  criado_por?: number;
  criado_em: string;
  atualizado_em: string;
  eliminado_em?: string | null;
}

export interface Document {
  id: number;
  titulo: string;
  descricao: string | null;
  nome_original: string;
  caminho_servidor: string;
  hash_ficheiro: string;
  tipo_mime: string;
  tamanho_bytes: number;
  categoria: string | null;
  criado_por?: number;
  criado_em: string;
  atualizado_em: string;
  eliminado_em?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JwtPayload {
  id: number;
  bilhete: string;
  tipo: TipoUtilizador;
  iat?: number;
  exp?: number;
}