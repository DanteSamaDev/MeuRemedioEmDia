import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RelatorioAdesao, Medicamento } from '../types';

interface RelatorioContextType {
  relatorios: RelatorioAdesao[];
  gerarRelatorioPeriodo: (periodo: 'semana' | 'mes') => Promise<RelatorioAdesao | null>;
  salvarDiarioMedicamentos: (medicamentos: Medicamento[]) => Promise<void>;
  obterHistorico: (periodo: string) => Promise<RelatorioAdesao | null>;
  limparRelatorios: () => Promise<void>;
}

const RelatorioContext = createContext<RelatorioContextType | undefined>(undefined);

interface EntradaDiaria {
  data: string;
  medicamentos: Medicamento[];
  tomados: number;
  total: number;
}

export function RelatorioProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [relatorios, setRelatorios] = useState<RelatorioAdesao[]>([]);

  const salvarDiarioMedicamentos = useCallback(async (medicamentos: Medicamento[]) => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const entrada: EntradaDiaria = {
        data: hoje,
        medicamentos,
        tomados: medicamentos.filter((m) => m.tomado).length,
        total: medicamentos.length,
      };

      const historico = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/historico_medicamentos'
      );
      const historicoArray: EntradaDiaria[] = historico ? JSON.parse(historico) : [];

      // Remover entrada do dia atual se existir
      const filtrado = historicoArray.filter((e) => e.data !== hoje);
      filtrado.push(entrada);

      // Manter apenas últimos 90 dias
      const noventa_dias_atras = new Date();
      noventa_dias_atras.setDate(noventa_dias_atras.getDate() - 90);
      const cortado = filtrado.filter(
        (e) => new Date(e.data) >= noventa_dias_atras
      );

      await AsyncStorage.setItem(
        '@meu_remedio_em_dia/historico_medicamentos',
        JSON.stringify(cortado)
      );
    } catch (erro) {
      console.error('Erro ao salvar diáriomedicamentos:', erro);
    }
  }, []);

  const gerarRelatorioPeriodo = useCallback(
    async (periodo: 'semana' | 'mes'): Promise<RelatorioAdesao | null> => {
      try {
        const historico = await AsyncStorage.getItem(
          '@meu_remedio_em_dia/historico_medicamentos'
        );

        if (!historico) return null;

        const historicoArray: EntradaDiaria[] = JSON.parse(historico);
        const agora = new Date();
        const diasAtras = periodo === 'semana' ? 7 : 30;

        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - diasAtras);

        const dadosPeriodo = historicoArray.filter(
          (e) => new Date(e.data) >= dataLimite
        );

        const totalDoses = dadosPeriodo.reduce((acc, e) => acc + e.total, 0);
        const dosesTomadas = dadosPeriodo.reduce((acc, e) => acc + e.tomados, 0);

        const percentual = totalDoses > 0
          ? Math.round((dosesTomadas / totalDoses) * 100)
          : 0;

        const relatorio: RelatorioAdesao = {
          periodo: `${diasAtras} dias`,
          diasTotal: dadosPeriodo.length,
          dosetomadas: dosesTomadas,
          dosesEsperadas: totalDoses,
          percentualAderencia: percentual,
          medicamentosMonitorados: new Set(
            dadosPeriodo.flatMap((e) => e.medicamentos.map((m) => m.nome))
          ).size,
        };

        return relatorio;
      } catch (erro) {
        console.error('Erro ao gerar relatório:', erro);
        return null;
      }
    },
    []
  );

  const obterHistorico = useCallback(
    async (periodo: string): Promise<RelatorioAdesao | null> => {
      if (periodo === 'semana' || periodo === 'mes') {
        return gerarRelatorioPeriodo(
          periodo as 'semana' | 'mes'
        );
      }
      return null;
    },
    [gerarRelatorioPeriodo]
  );

  const limparRelatorios = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(
        '@meu_remedio_em_dia/historico_medicamentos'
      );
      setRelatorios([]);
    } catch (erro) {
      console.error('Erro ao limpar relatórios:', erro);
    }
  }, []);

  const value: RelatorioContextType = {
    relatorios,
    gerarRelatorioPeriodo,
    salvarDiarioMedicamentos,
    obterHistorico,
    limparRelatorios,
  };

  return (
    <RelatorioContext.Provider value={value}>
      {children}
    </RelatorioContext.Provider>
  );
}

export function useRelatorios(): RelatorioContextType {
  const context = useContext(RelatorioContext);
  if (context === undefined) {
    throw new Error('useRelatorios deve ser usado dentro de RelatorioProvider');
  }
  return context;
}

export { RelatorioContext };
