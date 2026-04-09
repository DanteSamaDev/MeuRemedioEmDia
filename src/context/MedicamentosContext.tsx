import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicamento, ResumoDia } from '../types';

interface MedicamentosContextType {
  medicamentos: Medicamento[];
  resumoDia: ResumoDia;
  carregando: boolean;
  erro: string | null;
  adicionarMedicamento: (medicamento: Medicamento) => Promise<void>;
  atualizarMedicamento: (id: string, updates: Partial<Medicamento>) => Promise<void>;
  removerMedicamento: (id: string) => Promise<void>;
  marcarTomado: (id: string, tomado: boolean) => Promise<void>;
  limparMedicamentos: () => Promise<void>;
  recarregar: () => Promise<void>;
}

const MedicamentosContext = createContext<MedicamentosContextType | undefined>(
  undefined
);

export function MedicamentosProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Calcular resumo do dia
  const resumoDia: ResumoDia = {
    total: medicamentos.length,
    tomados: medicamentos.filter((m) => m.tomado).length,
    faltam: medicamentos.filter((m) => !m.tomado).length,
    percentual: medicamentos.length > 0
      ? Math.round(
          (medicamentos.filter((m) => m.tomado).length / medicamentos.length) * 100
        )
      : 0,
  };

  // Carregar medicamentos inicialmente
  const carregarMedicamentos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/medicamentos'
      );
      if (dados) {
        const med = JSON.parse(dados);
        setMedicamentos(med);
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar medicamentos');
      console.error('Erro ao carregar medicamentos:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Salvar medicamentos no AsyncStorage
  const salvarMedicamentos = useCallback(
    async (novosMedicamentos: Medicamento[]) => {
      try {
        await AsyncStorage.setItem(
          '@meu_remedio_em_dia/medicamentos',
          JSON.stringify(novosMedicamentos)
        );
        setMedicamentos(novosMedicamentos);
        setErro(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar medicamentos';
        setErro(msg);
        throw err;
      }
    },
    []
  );

  // Adicionar medicamento
  const adicionarMedicamento = useCallback(
    async (medicamento: Medicamento) => {
      try {
        const novosMedicamentos = [...medicamentos, medicamento];
        await salvarMedicamentos(novosMedicamentos);
      } catch (err) {
        console.error('Erro ao adicionar medicamento:', err);
        throw err;
      }
    },
    [medicamentos, salvarMedicamentos]
  );

  // Atualizar medicamento
  const atualizarMedicamento = useCallback(
    async (id: string, updates: Partial<Medicamento>) => {
      try {
        const novosMedicamentos = medicamentos.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        );
        await salvarMedicamentos(novosMedicamentos);
      } catch (err) {
        console.error('Erro ao atualizar medicamento:', err);
        throw err;
      }
    },
    [medicamentos, salvarMedicamentos]
  );

  // Remover medicamento
  const removerMedicamento = useCallback(
    async (id: string) => {
      try {
        const novosMedicamentos = medicamentos.filter((m) => m.id !== id);
        await salvarMedicamentos(novosMedicamentos);
      } catch (err) {
        console.error('Erro ao remover medicamento:', err);
        throw err;
      }
    },
    [medicamentos, salvarMedicamentos]
  );

  // Marcar como tomado
  const marcarTomado = useCallback(
    async (id: string, tomado: boolean) => {
      try {
        await atualizarMedicamento(id, {
          tomado,
          dataTomado: tomado ? new Date().toISOString().split('T')[0] : undefined,
        });
      } catch (err) {
        console.error('Erro ao marcar medicamento:', err);
        throw err;
      }
    },
    [atualizarMedicamento]
  );

  // Limpar todos os medicamentos
  const limparMedicamentos = useCallback(async () => {
    try {
      await salvarMedicamentos([]);
    } catch (err) {
      console.error('Erro ao limpar medicamentos:', err);
      throw err;
    }
  }, [salvarMedicamentos]);

  // Recarregar medicamentos
  const recarregar = useCallback(async () => {
    await carregarMedicamentos();
  }, [carregarMedicamentos]);

  // Efeito para carregar medicamentos ao montar o componente
  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const value: MedicamentosContextType = {
    medicamentos,
    resumoDia,
    carregando,
    erro,
    adicionarMedicamento,
    atualizarMedicamento,
    removerMedicamento,
    marcarTomado,
    limparMedicamentos,
    recarregar,
  };

  return (
    <MedicamentosContext.Provider value={value}>
      {children}
    </MedicamentosContext.Provider>
  );
}

/**
 * Hook para usar o contexto de medicamentos
 */
export function useMedicamentos(): MedicamentosContextType {
  const context = useContext(MedicamentosContext);
  if (context === undefined) {
    throw new Error(
      'useMedicamentos deve ser usado dentro de MedicamentosProvider'
    );
  }
  return context;
}

/**
 * Export do context para acesso direto se necessário
 */
export { MedicamentosContext };
