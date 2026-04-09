// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn()
  })
}));

describe('HeaderTela', () => {
  it('deve importar HeaderTela sem erros', () => {
    expect(() => {
      require('../src/components/HeaderTela');
    }).not.toThrow();
  });

  it('deve ter arquivo HeaderTela.tsx', () => {
    const { HeaderTela } = require('../src/components/HeaderTela');
    expect(HeaderTela).toBeDefined();
  });
});