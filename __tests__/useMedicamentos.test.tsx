import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMedicamentos } from '../useMedicamentos';

// Mock do StorageService
jest.mock('../src/services/StorageService', () => ({
  storageService: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockStorageService = require('../src/services/StorageService').storageService;

describe('useMedicamentos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageService.getItem.mockResolvedValue(null);
  });

  it('deve inicializar com estado vazio', async () => {
    const { result } = renderHook(() => useMedicamentos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.medicamentos).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('deve carregar medicamentos do storage', async () => {
    const mockMedicamentos = [
      {
        id: '1',
        nome: 'Paracetamol',
        dosagem: '500mg',
        periodo: 'manha' as const,
        horario: '08:00',
        tomado: false,
        estoque: 10,
        quantidade: 20,
        ativo: true,
      },
    ];

    mockStorageService.getItem.mockResolvedValue(JSON.stringify(mockMedicamentos));

    const { result } = renderHook(() => useMedicamentos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.medicamentos).toEqual(mockMedicamentos);
  });

  it('deve adicionar novo medicamento', async () => {
    mockStorageService.getItem.mockResolvedValue(JSON.stringify([]));
    mockStorageService.setItem.mockResolvedValue();

    const { result } = renderHook(() => useMedicamentos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const novoMedicamento = {
      nome: 'Ibuprofeno',
      dosagem: '400mg',
      periodo: 'tarde' as const,
      horario: '14:00',
      estoque: 15,
      quantidade: 30,
    };

    await act(async () => {
      await result.current.adicionarMedicamento(novoMedicamento);
    });

    expect(result.current.medicamentos).toHaveLength(1);
    expect(result.current.medicamentos[0].nome).toBe('Ibuprofeno');
    expect(result.current.medicamentos[0].id).toBeDefined();
    expect(mockStorageService.setItem).toHaveBeenCalled();
  });

  it('deve marcar medicamento como tomado', async () => {
    const mockMedicamentos = [
      {
        id: '1',
        nome: 'Paracetamol',
        dosagem: '500mg',
        periodo: 'manha' as const,
        horario: '08:00',
        tomado: false,
        estoque: 10,
        quantidade: 20,
        ativo: true,
      },
    ];

    mockStorageService.getItem.mockResolvedValue(JSON.stringify(mockMedicamentos));
    mockStorageService.setItem.mockResolvedValue();

    const { result } = renderHook(() => useMedicamentos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.marcarComoTomado('1');
    });

    expect(result.current.medicamentos[0].tomado).toBe(true);
    expect(result.current.medicamentos[0].dataTomado).toBeDefined();
    expect(mockStorageService.setItem).toHaveBeenCalled();
  });

  it('deve filtrar medicamentos corretamente', async () => {
    const mockMedicamentos = [
      {
        id: '1',
        nome: 'Paracetamol',
        dosagem: '500mg',
        periodo: 'manha' as const,
        horario: '08:00',
        tomado: true,
        estoque: 10,
        quantidade: 20,
        ativo: true,
      },
      {
        id: '2',
        nome: 'Ibuprofeno',
        dosagem: '400mg',
        periodo: 'tarde' as const,
        horario: '14:00',
        tomado: false,
        estoque: 2,
        quantidade: 20,
        ativo: true,
      },
    ];

    mockStorageService.getItem.mockResolvedValue(JSON.stringify(mockMedicamentos));

    const { result } = renderHook(() => useMedicamentos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Testar filtro "todos"
    let filtrados = result.current.filtrarMedicamentos({
      todos: true,
      tomados: false,
      naoTomados: false,
      estoqueBaixo: false,
    });
    expect(filtrados).toHaveLength(2);

    // Testar filtro "tomados"
    filtrados = result.current.filtrarMedicamentos({
      todos: false,
      tomados: true,
      naoTomados: false,
      estoqueBaixo: false,
    });
    expect(filtrados).toHaveLength(1);
    expect(filtrados[0].nome).toBe('Paracetamol');

    // Testar filtro "estoque baixo"
    filtrados = result.current.filtrarMedicamentos({
      todos: false,
      tomados: false,
      naoTomados: false,
      estoqueBaixo: true,
    });
    expect(filtrados).toHaveLength(1);
    expect(filtrados[0].nome).toBe('Ibuprofeno');
  });

  it('deve calcular resumo do dia corretamente', async () => {
    const mockMedicamentos = [
      {
        id: '1',
        nome: 'Paracetamol',
        dosagem: '500mg',
        periodo: 'manha' as const,
        horario: '08:00',
        tomado: true,
        estoque: 10,
        quantidade: 20,
        ativo: true,
      },
      {
        id: '2',
        nome: 'Ibuprofeno',
        dosagem: '400mg',
        periodo: 'tarde' as const,
        horario: '14:00',
        tomado: false,
        estoque: 15,
        quantidade: 30,
        ativo: true,
      },
    ];

    mockStorageService.getItem.mockResolvedValue(JSON.stringify(mockMedicamentos));

    const { result } = renderHook(() => useMedicamentos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const resumo = result.current.calcularResumoDia();

    expect(resumo.total).toBe(2);
    expect(resumo.tomados).toBe(1);
    expect(resumo.percentual).toBe(50);
  });
});