/**
 * Tipos TypeScript para a aplicação
 * Definição de interfaces e tipos usados em todo o app
 */

// Períodos do dia para medicamentos
export type Periodo = 'manha' | 'tarde' | 'noite';

// Abas principais da aplicação
export type Aba = 'medicamentos' | 'direitos' | 'urgencia' | 'farmacias';

// Temas disponíveis
export type ThemeType = 'light' | 'dark';

/**
 * Interface para medicamentos
 */
export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  periodo: Periodo;
  horario: string;
  tomado: boolean;
  dataTomado?: string; // Data da última tomada
  observacao?: string;
  estoque: number; // Quantidade atual
  quantidade: number; // Quantidade total
  consumoPorDose?: number;
  ativo: boolean; // Se o medicamento está ativo
}

/**
 * Interface para direitos em saúde
 */
export interface Direito {
  id: string;
  titulo: string;
  descricao: string;
  passos: string[];
  categoria: 'sus' | 'judicial' | 'isencao';
  fontes?: string[]; // Links para fontes oficiais
  atualizado?: string; // Data de atualização
}

/**
 * Interface para ações rápidas
 */
export interface AcaoRapida {
  id: string;
  titulo: string;
  descricao: string;
  telefone?: string;
  url?: string;
  categoria?: 'emergencia' | 'informacao' | 'politica';
}

/**
 * Interface para farmácias conveniadas
 */
export interface FarmaciaConveniada {
  id: string;
  nome: string;
  regiao: string;
  temEntrega: boolean;
  temApp: boolean;
  temAtendimentoTelefone?: boolean;
  telefone?: string;
  appUrl?: string;
  horario?: string;
  temMedicamentoGenerico?: boolean;
  temMedicamentoManipulado?: boolean;
  temDesconto?: boolean;
  descricao?: string;
  classificacao?: number; // 1-5 stars
}

/**
 * Interface para resumo diário
 */
export interface ResumoDia {
  total: number;
  tomados: number;
  faltam: number;
  percentual: number;
}

/**
 * Interface para relatório de adesão
 */
export interface RelatorioAdesao {
  periodo: string; // Ex: "Abril 2026"
  diasTotal: number;
  dosetomadas: number;
  dosesEsperadas: number;
  percentualAderencia: number;
  medicamentosMonitorados: number;
}

/**
 * Interface para estado de autenticação
 */
export interface EstadoAutenticacao {
  autenticado: boolean;
  tipoAutenticacao?: 'pin' | 'biometria';
  ultimaAutenticacao?: string;
}

/**
 * Interface para configurações de notificação
 */
export interface ConfigNotificacao {
  habilitada: boolean;
  minutosAntes: number; // Quantos minutos antes alertar
  som: boolean;
  vibracao: boolean;
}

/**
 * Interface para configurações do usuário
 */
export interface Configuracoesusuario {
  tema: ThemeType;
  notificacoes: ConfigNotificacao;
  linguagem: 'pt-BR' | 'en-US';
  tamanhoFonte: 'pequeno' | 'normal' | 'grande';
}
