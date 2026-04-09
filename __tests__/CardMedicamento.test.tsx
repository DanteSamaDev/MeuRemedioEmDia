// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('CardMedicamento', () => {
  it('deve importar CardMedicamento sem erros', () => {
    expect(() => {
      require('../src/components/CardMedicamento');
    }).not.toThrow();
  });

  it('deve ter arquivo CardMedicamento.tsx', () => {
    const { CardMedicamento } = require('../src/components/CardMedicamento');
    expect(CardMedicamento).toBeDefined();
  });
});