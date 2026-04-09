import { StorageService } from '../src/services/StorageService';

const storageService = StorageService.getInstance();

// Mock do AsyncStorage e EncryptedStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockAsyncStorage = require('@react-native-async-storage/async-storage');
const mockEncryptedStorage = require('react-native-encrypted-storage');

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Armazenamento Seguro', () => {
    it('deve armazenar dados sensíveis com sucesso', async () => {
      const testData = 'dados sensíveis';
      mockEncryptedStorage.setItem.mockResolvedValue();

      await storageService.setSecureItem('testKey', testData);

      expect(mockEncryptedStorage.setItem).toHaveBeenCalledWith('testKey', testData);
    });

    it('deve recuperar dados sensíveis com sucesso', async () => {
      const testData = 'dados recuperados';
      mockEncryptedStorage.getItem.mockResolvedValue(testData);

      const result = await storageService.getSecureItem('testKey');

      expect(result).toBe(testData);
      expect(mockEncryptedStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    it('deve retornar null quando não conseguir recuperar dados seguros', async () => {
      mockEncryptedStorage.getItem.mockRejectedValue(new Error('Erro'));

      const result = await storageService.getSecureItem('testKey');

      expect(result).toBeNull();
    });

    it('deve remover dados sensíveis com sucesso', async () => {
      mockEncryptedStorage.removeItem.mockResolvedValue();

      await storageService.removeSecureItem('testKey');

      expect(mockEncryptedStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('deve limpar todo armazenamento seguro', async () => {
      mockEncryptedStorage.clear.mockResolvedValue();

      await storageService.clearSecureStorage();

      expect(mockEncryptedStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Armazenamento Regular', () => {
    it('deve armazenar dados não sensíveis com sucesso', async () => {
      const testData = 'dados regulares';
      mockAsyncStorage.setItem.mockResolvedValue();

      await storageService.setItem('testKey', testData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('testKey', testData);
    });

    it('deve recuperar dados não sensíveis com sucesso', async () => {
      const testData = 'dados recuperados';
      mockAsyncStorage.getItem.mockResolvedValue(testData);

      const result = await storageService.getItem('testKey');

      expect(result).toBe(testData);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    it('deve retornar null quando não conseguir recuperar dados', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Erro'));

      const result = await storageService.getItem('testKey');

      expect(result).toBeNull();
    });

    it('deve remover dados não sensíveis com sucesso', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await storageService.removeItem('testKey');

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('deve retornar lista vazia quando não conseguir obter chaves', async () => {
      mockAsyncStorage.getAllKeys.mockRejectedValue(new Error('Erro'));

      const result = await storageService.getAllKeys();

      expect(result).toEqual([]);
    });

    it('deve limpar todo armazenamento não sensível', async () => {
      mockAsyncStorage.clear.mockResolvedValue();

      await storageService.clearStorage();

      expect(mockAsyncStorage.clear).toHaveBeenCalled();
    });
  });
});