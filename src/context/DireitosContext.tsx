import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Direito } from '../types';

interface DireitosContextType {
  direitos: Direito[];
  carregando: boolean;
  erro: string | null;
  adicionarDireito: (direito: Direito) => Promise<void>;
  atualizarDireito: (id: string, updates: Partial<Direito>) => Promise<void>;
  removerDireito: (id: string) => Promise<void>;
  obterDireitosPorCategoria: (categoria: 'sus' | 'judicial' | 'isencao') => Direito[];
  buscarDireito: (termo: string) => Direito[];
  recarregar: () => Promise<void>;
}

const DireitosContext = createContext<DireitosContextType | undefined>(undefined);

const DIREITOS_PADRAO: Direito[] = [
  {
    id: '1',
    titulo: 'Acesso Universal ao SUS',
    descricao:
      'Todo brasileiro tem direito de acessar medicamentos e tratamentos através do SUS gratuitamente.',
    passos: [
      'Procure uma unidade básica de saúde (Posto ou Centro de Saúde)',
      'Agende uma consulta com seu médico',
      'Apresente seus documentos pessoais (CPF, RG, Cartão do SUS)',
      'Se prescrito, retire o medicamento na farmácia da unidade',
    ],
    categoria: 'sus',
    atualizado: new Date().toISOString(),
  },
  {
    id: '2',
    titulo: 'Medicamentos Genéricos com Desconto',
    descricao:
      'Você tem direito a receber medicamentos genéricos com preço reduzido nas farmácias participantes.',
    passos: [
      'Procure farmácias que ofereçam o programa de genéricos',
      'Solicite a versão genérica do medicamento prescrito',
      'Apresente o receituário médico',
      'Aproveite os descontos oferecidos (até 80% de redução)',
    ],
    categoria: 'sus',
    atualizado: new Date().toISOString(),
  },
  {
    id: '3',
    titulo: 'Direito a Medicamentos de Alto Custo',
    descricao:
      'Pacientes com doenças crônicas podem ter acesso a medicamentos de alto custo pelo SUS.',
    passos: [
      'Obtenha diagnóstico médico confirmado',
      'Solicite ao seu médico uma requisição oficial',
      'Procure a secretaria de saúde do seu município',
      'Apresente toda documentação médica necessária',
      'Aguarde análise e aprovação do pedido',
    ],
    categoria: 'judicial',
    atualizado: new Date().toISOString(),
  },
  {
    id: '4',
    titulo: 'Isenção de ICMS em Medicamentos',
    descricao:
      'Pessoas com deficiência, diabéticos e portadores de epilepsia podem ter isenção de impostos.',
    passos: [
      'Verifique se você se enquadra em alguma das categorias',
      'Obtenha laudo comprobatório junto ao órgão competente',
      'Apresente o laudo na farmácia',
      'Solicite a isenção de ICMS e PIS/COFINS',
      'O medicamento terá preço reduzido automaticamente',
    ],
    categoria: 'isencao',
    atualizado: new Date().toISOString(),
  },
];

export function DireitosProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [direitos, setDireitos] = useState<Direito[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDireitos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/direitos'
      );
      if (dados) {
        setDireitos(JSON.parse(dados));
      } else {
        setDireitos(DIREITOS_PADRAO);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar direitos';
      setErro(msg);
      console.error('Erro ao carregar direitos:', err);
      setDireitos(DIREITOS_PADRAO);
    } finally {
      setCarregando(false);
    }
  }, []);

  const salvarDireitos = useCallback(async (novosDireitos: Direito[]) => {
    try {
      await AsyncStorage.setItem(
        '@meu_remedio_em_dia/direitos',
        JSON.stringify(novosDireitos)
      );
      setDireitos(novosDireitos);
      setErro(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar direitos';
      setErro(msg);
      throw err;
    }
  }, []);

  const adicionarDireito = useCallback(
    async (direito: Direito) => {
      try {
        const novosDireitos = [...direitos, direito];
        await salvarDireitos(novosDireitos);
      } catch (err) {
        console.error('Erro ao adicionar direito:', err);
        throw err;
      }
    },
    [direitos, salvarDireitos]
  );

  const atualizarDireito = useCallback(
    async (id: string, updates: Partial<Direito>) => {
      try {
        const novosDireitos = direitos.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        );
        await salvarDireitos(novosDireitos);
      } catch (err) {
        console.error('Erro ao atualizar direito:', err);
        throw err;
      }
    },
    [direitos, salvarDireitos]
  );

  const removerDireito = useCallback(
    async (id: string) => {
      try {
        const novosDireitos = direitos.filter((d) => d.id !== id);
        await salvarDireitos(novosDireitos);
      } catch (err) {
        console.error('Erro ao remover direito:', err);
        throw err;
      }
    },
    [direitos, salvarDireitos]
  );

  const obterDireitosPorCategoria = useCallback(
    (categoria: 'sus' | 'judicial' | 'isencao') => {
      return direitos.filter((d) => d.categoria === categoria);
    },
    [direitos]
  );

  const buscarDireito = useCallback(
    (termo: string) => {
      const termoLower = termo.toLowerCase();
      return direitos.filter(
        (d) =>
          d.titulo.toLowerCase().includes(termoLower) ||
          d.descricao.toLowerCase().includes(termoLower)
      );
    },
    [direitos]
  );

  const recarregar = useCallback(async () => {
    await carregarDireitos();
  }, [carregarDireitos]);

  useEffect(() => {
    carregarDireitos();
  }, [carregarDireitos]);

  const value: DireitosContextType = {
    direitos,
    carregando,
    erro,
    adicionarDireito,
    atualizarDireito,
    removerDireito,
    obterDireitosPorCategoria,
    buscarDireito,
    recarregar,
  };

  return (
    <DireitosContext.Provider value={value}>
      {children}
    </DireitosContext.Provider>
  );
}

export function useDireitos(): DireitosContextType {
  const context = useContext(DireitosContext);
  if (context === undefined) {
    throw new Error('useDireitos deve ser usado dentro de DireitosProvider');
  }
  return context;
}

export { DireitosContext };
