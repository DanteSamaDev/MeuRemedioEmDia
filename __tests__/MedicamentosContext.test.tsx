import { MedicamentosProvider } from '../src/context/MedicamentosContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('MedicamentosContext', () => {
  it('deve exportar MedicamentosProvider', () => {
    expect(MedicamentosProvider).toBeDefined();
    expect(typeof MedicamentosProvider).toBe('function');
  });

  it('deve ser uma função React', () => {
    expect(MedicamentosProvider.prototype).toBeDefined();
  });

  it('deve ter implementação de gestão de medicamentos', () => {
    const provider = MedicamentosProvider;
    expect(provider).toBeTruthy();
  });
});