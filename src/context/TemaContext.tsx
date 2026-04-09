/**
 * Context de Tema (Light/Dark)
 * Gerencia o tema da aplicação e sincroniza com AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeType } from '../types';

const STORAGE_TEMA = '@meu_remedio_em_dia/tema';

interface TemaContextType {
  tema: ThemeType;
  alternarTema: () => void;
  definirTema: (novoTema: ThemeType) => void;
  cores: Record<string, string>;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

/**
 * Cores para tema claro
 */
export const CORES_CLARO = {
  fundo: '#F3F6FB',
  superficiePrimaria: '#FFFFFF',
  texto: '#102A43',
  textoSecundario: '#486581',
  textoBranco: '#FFFFFF',
  borda: '#D9E2EF',
  primaria: '#0B74DE',
  sucesso: '#00A676',
  aviso: '#F8B4B4',
  erro: '#9B1C1C',
  neutra: '#E6EEF8',
};

/**
 * Cores para tema escuro
 */
export const CORES_ESCURO = {
  fundo: '#0F1419',
  superficiePrimaria: '#1A2634',
  texto: '#F3F6FB',
  textoSecundario: '#A3B3C3',
  textoBranco: '#FFFFFF',
  borda: '#2D3F52',
  primaria: '#2D7FE8',
  sucesso: '#27C896',
  aviso: '#D47373',
  erro: '#DD5D5D',
  neutra: '#273548',
};

interface TemaProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de Tema
 */
export const TemaProvider: React.FC<TemaProviderProps> = ({ children }) => {
  const [tema, setTema] = useState<ThemeType>('light');
  const [carregando, setCarregando] = useState(true);

  // Carregar tema do AsyncStorage ao inicializar
  useEffect(() => {
    const carregarTema = async () => {
      try {
        const temaSalvo = await AsyncStorage.getItem(STORAGE_TEMA);
        if (temaSalvo === 'dark' || temaSalvo === 'light') {
          setTema(temaSalvo);
        }
      } catch (erro) {
        console.error('Erro ao carregar tema:', erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarTema();
  }, []);

  const alternarTema = () => {
    const novoTema: ThemeType = tema === 'light' ? 'dark' : 'light';
    definirTema(novoTema);
  };

  const definirTema = async (novoTema: ThemeType) => {
    setTema(novoTema);
    try {
      await AsyncStorage.setItem(STORAGE_TEMA, novoTema);
    } catch (erro) {
      console.error('Erro ao salvar tema:', erro);
    }
  };

  const cores = tema === 'light' ? CORES_CLARO : CORES_ESCURO;

  if (carregando) {
    return null; // Ou tela de carregamento
  }

  return (
    <TemaContext.Provider value={{ tema, alternarTema, definirTema, cores }}>
      {children}
    </TemaContext.Provider>
  );
};

/**
 * Hook para usar o contexto de tema
 */
export const useTema = (): TemaContextType => {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de TemaProvider');
  }
  return contexto;
};
