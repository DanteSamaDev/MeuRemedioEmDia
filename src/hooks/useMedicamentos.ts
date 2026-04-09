import { useState, useEffect, useCallback } from 'react';
import { Medicamento } from '../types';
import { storageService } from '../services/StorageService';

const STORAGE_KEY_MEDICAMENTOS = '@meu_remedio_em_dia/medicamentos';

export interface UseMedicamentosReturn {
  medicamentos: Medicamento[];
  loading: boolean;
  error: string | null;
  adicionarMedicamento: (medicamento: Omit<Medicamento, 'id'>) => Promise<void>;
  atualizarMedicamento: (id: string, updates: Partial<Medicamento>) => Promise<void>;
  removerMedicamento: (id: string) => Promise<void>;
  marcarComoTomado: (id: string) => Promise<void>;
  filtrarMedicamentos: (filtro: {
    todos: boolean;
    tomados: boolean;
    naoTomados: boolean;
    estoqueBaixo: boolean;
  }) => Medicamento[];
  calcularResumoDia: () => {
    total: number;
    tomados: number;
    percentual: number;
  };
}

/**
 * Hook customizado para gerenciar medicamentos
 * Centraliza lógica de negócio e estado dos medicamentos
 */
export function useMedicamentos(): UseMedicamentosReturn {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar medicamentos do armazenamento
  const carregarMedicamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dados = await storageService.getItem(STORAGE_KEY_MEDICAMENTOS);
      if (dados) {
        const parsed = JSON.parse(dados);
        setMedicamentos(parsed);
      }
    } catch (err) {
      setError('Erro ao carregar medicamentos');
      console.error('Erro ao carregar medicamentos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar medicamentos no armazenamento
  const salvarMedicamentos = useCallback(async (novosMedicamentos: Medicamento[]) => {
    try {
      await storageService.setItem(STORAGE_KEY_MEDICAMENTOS, JSON.stringify(novosMedicamentos));
    } catch (err) {
      console.error('Erro ao salvar medicamentos:', err);
      throw err;
    }
  }, []);

  // Adicionar novo medicamento
  const adicionarMedicamento = useCallback(async (medicamento: Omit<Medicamento, 'id'>) => {
    try {
      const novoMedicamento: Medicamento = {
        ...medicamento,
        id: Date.now().toString(),
        tomado: false,
        ativo: true,
      };

      const novosMedicamentos = [...medicamentos, novoMedicamento];
      setMedicamentos(novosMedicamentos);
      await salvarMedicamentos(novosMedicamentos);
    } catch (err) {
      setError('Erro ao adicionar medicamento');
      throw err;
    }
  }, [medicamentos, salvarMedicamentos]);

  // Atualizar medicamento existente
  const atualizarMedicamento = useCallback(async (id: string, updates: Partial<Medicamento>) => {
    try {
      const novosMedicamentos = medicamentos.map(med =>
        med.id === id ? { ...med, ...updates } : med
      );
      setMedicamentos(novosMedicamentos);
      await salvarMedicamentos(novosMedicamentos);
    } catch (err) {
      setError('Erro ao atualizar medicamento');
      throw err;
    }
  }, [medicamentos, salvarMedicamentos]);

  // Remover medicamento
  const removerMedicamento = useCallback(async (id: string) => {
    try {
      const novosMedicamentos = medicamentos.filter(med => med.id !== id);
      setMedicamentos(novosMedicamentos);
      await salvarMedicamentos(novosMedicamentos);
    } catch (err) {
      setError('Erro ao remover medicamento');
      throw err;
    }
  }, [medicamentos, salvarMedicamentos]);

  // Marcar medicamento como tomado
  const marcarComoTomado = useCallback(async (id: string) => {
    try {
      const agora = new Date().toISOString();
      await atualizarMedicamento(id, {
        tomado: true,
        dataTomado: agora,
      });
    } catch (err) {
      setError('Erro ao marcar medicamento como tomado');
      throw err;
    }
  }, [atualizarMedicamento]);

  // Filtrar medicamentos
  const filtrarMedicamentos = useCallback((filtro: {
    todos: boolean;
    tomados: boolean;
    naoTomados: boolean;
    estoqueBaixo: boolean;
  }) => {
    return medicamentos.filter(med => {
      if (filtro.todos) return true;
      if (filtro.tomados && med.tomado) return true;
      if (filtro.naoTomados && !med.tomado) return true;
      if (filtro.estoqueBaixo && med.estoque / med.quantidade <= 0.2) return true;
      return false;
    });
  }, [medicamentos]);

  // Calcular resumo do dia
  const calcularResumoDia = useCallback(() => {
    const total = medicamentos.length;
    const tomados = medicamentos.filter(med => med.tomado).length;
    const percentual = total > 0 ? Math.round((tomados / total) * 100) : 0;

    return { total, tomados, percentual };
  }, [medicamentos]);

  // Carregar dados na inicialização
  useEffect(() => {
    carregarMedicamentos();
  }, [carregarMedicamentos]);

  return {
    medicamentos,
    loading,
    error,
    adicionarMedicamento,
    atualizarMedicamento,
    removerMedicamento,
    marcarComoTomado,
    filtrarMedicamentos,
    calcularResumoDia,
  };
}