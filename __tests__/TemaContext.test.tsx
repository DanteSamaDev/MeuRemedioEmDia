import { TemaProvider } from '../src/context/TemaContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('TemaContext', () => {
  it('deve exportar TemaProvider', () => {
    expect(TemaProvider).toBeDefined();
    expect(typeof TemaProvider).toBe('function');
  });

  it('deve ser uma função React', () => {
    // Verifica se é um componente React válido
    expect(TemaProvider.prototype).toBeDefined();
  });
});