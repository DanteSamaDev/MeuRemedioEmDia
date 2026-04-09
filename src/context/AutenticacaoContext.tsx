/**
 * Context de Autenticação
 * Gerencia autenticação local com PIN ou Biometria
 */

import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstadoAutenticacao } from '../types';

const STORAGE_PIN = '@meu_remedio_em_dia/pin';
const STORAGE_BIOMETRIA_HABILITADA = '@meu_remedio_em_dia/biometria_habilitada';

interface AutenticacaoContextType {
  autenticado: boolean;
  pinConfigurable: boolean;
  autenticarComPin: (pin: string) => Promise<boolean>;
  definirPin: (novoPIN: string) => Promise<boolean>;
  apagarPin: (pin: string) => Promise<boolean>;
  desautenticar: () => void;
  verificarPinConfigurable: () => Promise<boolean>;
}

const AutenticacaoContext = createContext<AutenticacaoContextType | undefined>(undefined);

interface AutenticacaoProviderProps {
  children: React.ReactNode;
}

export const AutenticacaoProvider: React.FC<AutenticacaoProviderProps> = ({ children }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [pinConfigurable, setPinConfigurable] = useState(false);

  // Verificar se PIN está configured ao inicializar
  React.useEffect(() => {
    verificarPinConfigurable();
  }, []);

  const verificarPinConfigurable = async (): Promise<boolean> => {
    try {
      const pin = await AsyncStorage.getItem(STORAGE_PIN);
      const temPin = pin !== null && pin !== '';
      setPinConfigurable(temPin);
      return temPin;
    } catch (erro) {
      console.error('Erro ao verificar PIN:', erro);
      return false;
    }
  };

  const autenticarComPin = async (pin: string): Promise<boolean> => {
    try {
      const pinArmazenado = await AsyncStorage.getItem(STORAGE_PIN);
      
      if (pinArmazenado === null) {
        console.log('PIN não configurado');
        return false;
      }

      if (pin === pinArmazenado) {
        setAutenticado(true);
        return true;
      }

      return false;
    } catch (erro) {
      console.error('Erro ao autenticar:', erro);
      return false;
    }
  };

  const definirPin = async (novoPIN: string): Promise<boolean> => {
    // Validar PIN (4-6 dígitos)
    if (!novoPIN || !/^\d{4,6}$/.test(novoPIN)) {
      return false;
    }

    try {
      await AsyncStorage.setItem(STORAGE_PIN, novoPIN);
      setPinConfigurable(true);
      setAutenticado(true);
      return true;
    } catch (erro) {
      console.error('Erro ao definir PIN:', erro);
      return false;
    }
  };

  const apagarPin = async (pin: string): Promise<boolean> => {
    try {
      const pinArmazenado = await AsyncStorage.getItem(STORAGE_PIN);
      
      if (pinArmazenado !== pin) {
        return false;
      }

      await AsyncStorage.removeItem(STORAGE_PIN);
      await AsyncStorage.removeItem(STORAGE_BIOMETRIA_HABILITADA);
      setPinConfigurable(false);
      setAutenticado(false);
      return true;
    } catch (erro) {
      console.error('Erro ao apagar PIN:', erro);
      return false;
    }
  };

  const desautenticar = () => {
    setAutenticado(false);
  };

  return (
    <AutenticacaoContext.Provider
      value={{
        autenticado,
        pinConfigurable,
        autenticarComPin,
        definirPin,
        apagarPin,
        desautenticar,
        verificarPinConfigurable,
      }}
    >
      {children}
    </AutenticacaoContext.Provider>
  );
};

/**
 * Hook para usar o contexto de autenticação
 */
export const useAutenticacao = (): AutenticacaoContextType => {
  const contexto = useContext(AutenticacaoContext);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de AutenticacaoProvider');
  }
  return contexto;
};
