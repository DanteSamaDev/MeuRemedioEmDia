import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import { RelatorioAdesao, Medicamento } from '../types';

interface RelatorioContextType {
  relatorios: RelatorioAdesao[];
  gerarRelatorioPeriodo: (periodo: 'semana' | 'mes') => Promise<RelatorioAdesao | null>;
  salvarDiarioMedicamentos: (medicamentos: Medicamento[]) => Promise<void>;
  obterHistorico: (periodo: string) => Promise<RelatorioAdesao | null>;
  limparRelatorios: () => Promise<void>;
  gerarRelatorioPDF: (relatorio: RelatorioAdesao) => Promise<string | null>;
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
          // Campos para PDF
          totalDoses,
          dosesTomadas,
          porcentagemAdesao: percentual,
          medicamentos: [], // Será preenchido se necessário
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

  const gerarRelatorioPDF = useCallback(async (relatorio: RelatorioAdesao): Promise<string | null> => {
    try {
      // Criar uma nova página PDF
      const page1 = PDFPage
        .create()
        .setMediaBox(200, 400)
        .drawText('Relatório de Adesão - Meu Remédio em Dia', {
          x: 5,
          y: 380,
          fontSize: 16,
        })
        .drawText(`Período: ${relatorio.periodo}`, {
          x: 5,
          y: 360,
          fontSize: 12,
        })
        .drawText(`Total de Doses: ${relatorio.totalDoses || relatorio.dosesEsperadas}`, {
          x: 5,
          y: 340,
          fontSize: 12,
        })
        .drawText(`Doses Tomadas: ${relatorio.dosesTomadas || relatorio.dosetomadas}`, {
          x: 5,
          y: 320,
          fontSize: 12,
        })
        .drawText(`Adesão: ${relatorio.porcentagemAdesao || relatorio.percentualAderencia}%`, {
          x: 5,
          y: 300,
          fontSize: 12,
        })
        .drawText(`Medicamentos Monitorados: ${relatorio.medicamentosMonitorados}`, {
          x: 5,
          y: 280,
          fontSize: 12,
        });

      // Adicionar informações dos medicamentos se disponíveis
      let yPosition = 260;
      if (relatorio.medicamentos && relatorio.medicamentos.length > 0) {
        page1.drawText('Medicamentos:', {
          x: 5,
          y: yPosition,
          fontSize: 14,
        });
        yPosition -= 20;

        relatorio.medicamentos.forEach((med, index) => {
          if (yPosition > 50) { // Evitar escrever fora da página
            page1.drawText(`${index + 1}. ${med.nome} (${med.dosagem}) - ${med.porcentagemAdesao}%`, {
              x: 5,
              y: yPosition,
              fontSize: 10,
            });
            yPosition -= 15;
          }
        });
      }

      // Adicionar data de geração
      page1.drawText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, {
        x: 5,
        y: 30,
        fontSize: 8,
      });

      // Criar o documento PDF
      const docsDir = PDFLib.getDocumentsDirectory();
      const pdfPath = `${docsDir}/relatorio_${Date.now()}.pdf`;

      const pdfDoc = PDFDocument
        .create(pdfPath)
        .addPages([page1]);

      // Salvar o PDF
      const pdfBytes = await pdfDoc.write();

      return pdfPath;
    } catch (erro) {
      console.error('Erro ao gerar PDF:', erro);
      return null;
    }
  }, []);

  const value: RelatorioContextType = {
    relatorios,
    gerarRelatorioPeriodo,
    salvarDiarioMedicamentos,
    obterHistorico,
    limparRelatorios,
    gerarRelatorioPDF,
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
