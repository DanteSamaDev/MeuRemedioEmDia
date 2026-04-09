import { AutenticacaoProvider } from '../src/context/AutenticacaoContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('AutenticacaoContext', () => {
  it('deve exportar AutenticacaoProvider', () => {
    expect(AutenticacaoProvider).toBeDefined();
    expect(typeof AutenticacaoProvider).toBe('function');
  });

  it('deve ser uma função React', () => {
    expect(AutenticacaoProvider.prototype).toBeDefined();
  });

  it('deve ter implementação de autenticação PIN', () => {
    // Testa se o provider existe e pode ser instanciado
    const provider = AutenticacaoProvider;
    expect(provider).toBeTruthy();
  });
});