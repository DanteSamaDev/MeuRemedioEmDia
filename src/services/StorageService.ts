import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * Serviço de armazenamento seguro para dados sensíveis
 * Usa EncryptedStorage para dados críticos e AsyncStorage para dados não sensíveis
 */
class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = StorageService;
    }
    return StorageService.instance;
  }

  /**
   * Armazena dados sensíveis com criptografia
   */
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error('Erro ao salvar dado seguro:', error);
      throw error;
    }
  }

  /**
   * Recupera dados sensíveis criptografados
   */
  async getSecureItem(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao recuperar dado seguro:', error);
      return null;
    }
  }

  /**
   * Remove dados sensíveis
   */
  async removeSecureItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover dado seguro:', error);
    }
  }

  /**
   * Limpa todos os dados sensíveis
   */
  async clearSecureStorage(): Promise<void> {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar armazenamento seguro:', error);
    }
  }

  /**
   * Armazena dados não sensíveis (configurações, cache, etc.)
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Erro ao salvar dado:', error);
      throw error;
    }
  }

  /**
   * Recupera dados não sensíveis
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao recuperar dado:', error);
      return null;
    }
  }

  /**
   * Remove dados não sensíveis
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover dado:', error);
    }
  }

  /**
   * Recupera todos os dados não sensíveis
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Erro ao recuperar chaves:', error);
      return [];
    }
  }

  /**
   * Limpa todos os dados não sensíveis
   */
  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
    }
  }
}

export const storageService = StorageService.getInstance();
export { StorageService };