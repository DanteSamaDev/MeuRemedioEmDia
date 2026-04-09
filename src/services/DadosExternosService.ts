import { Direito, Farmacia } from '../types';

/**
 * Serviço para gerenciar dados externos
 * Em produção, isso se conectaria a uma API
 * Por enquanto, simula uma API com dados locais e validação
 */
class DadosExternosService {
  private static instance: DadosExternosService;
  private baseUrl = 'https://api.meuremedioemdia.com'; // URL da API em produção

  private constructor() {}

  static getInstance(): DadosExternosService {
    if (!DadosExternosService.instance) {
      DadosExternosService.instance = DadosExternosService;
    }
    return DadosExternosService.instance;
  }

  /**
   * Busca direitos de saúde atualizados
   * Em produção: faz requisição para API
   * Desenvolvimento: retorna dados locais com validação
   */
  async buscarDireitos(): Promise<Direito[]> {
    try {
      // Em produção, descomente:
      // const response = await fetch(`${this.baseUrl}/direitos`);
      // return await response.json();

      // Dados locais para desenvolvimento
      return [
        {
          id: '1',
          titulo: 'Medicamentos Gratuitos pelo SUS',
          descricao: 'Todo cidadão brasileiro tem direito a medicamentos gratuitos através do Sistema Único de Saúde.',
          passos: [
            'Procure uma unidade básica de saúde (UBS) mais próxima',
            'Apresente documento de identidade e CPF',
            'Informe o nome do medicamento prescrito',
            'Aguarde avaliação médica para autorização'
          ],
          categoria: 'sus',
          fontes: ['http://www.saude.gov.br/sus'],
          atualizado: '2026-04-09'
        },
        {
          id: '2',
          titulo: 'Cirurgias Eletivas Gratuitas',
          descricao: 'Cirurgias não urgentes podem ser realizadas gratuitamente pelo SUS.',
          passos: [
            'Consulte seu médico para indicação da cirurgia',
            'Procure a regulação municipal ou estadual',
            'Entre na fila de espera conforme prioridade',
            'Acompanhe o status através do aplicativo Conecte SUS'
          ],
          categoria: 'sus',
          fontes: ['https://www.gov.br/saude/pt-br/assuntos/conecte-sus'],
          atualizado: '2026-04-09'
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar direitos:', error);
      throw new Error('Não foi possível carregar os direitos. Tente novamente.');
    }
  }

  /**
   * Busca farmácias disponíveis na região
   * Em produção: faz requisição para API com geolocalização
   * Desenvolvimento: retorna dados locais
   */
  async buscarFarmacias(latitude?: number, longitude?: number): Promise<Farmacia[]> {
    try {
      // Em produção, descomente:
      // const params = latitude && longitude ? `?lat=${latitude}&lng=${longitude}` : '';
      // const response = await fetch(`${this.baseUrl}/farmacias${params}`);
      // return await response.json();

      // Dados locais para desenvolvimento
      return [
        {
          id: '1',
          nome: 'Drogasil',
          endereco: 'Av. Paulista, 1000 - São Paulo/SP',
          telefone: '(11) 3000-1000',
          tipo: 'privada',
          programas: ['Desconto para aposentados', 'Genéricos'],
          horario: '24 horas',
          coordenadas: { latitude: -23.5505, longitude: -46.6333 }
        },
        {
          id: '2',
          nome: 'Farmácia Popular',
          endereco: 'Rua da Saúde, 500 - Rio de Janeiro/RJ',
          telefone: '136',
          tipo: 'governamental',
          programas: ['Medicamentos gratuitos', 'Programa Farmácia Popular'],
          horario: '08:00 - 18:00',
          coordenadas: { latitude: -22.9068, longitude: -43.1729 }
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar farmácias:', error);
      throw new Error('Não foi possível carregar as farmácias. Tente novamente.');
    }
  }

  /**
   * Valida se um link é seguro e oficial
   */
  validarLink(url: string): boolean {
    const dominiosOficiais = [
      'gov.br',
      'saude.gov.br',
      'ans.gov.br',
      'anvisa.gov.br'
    ];

    try {
      const urlObj = new URL(url);
      return dominiosOficiais.some(dominio => urlObj.hostname.endsWith(dominio));
    } catch {
      return false;
    }
  }

  /**
   * Reporta problema com dados (para governança)
   */
  async reportarProblema(tipo: 'direito' | 'farmacia', id: string, problema: string): Promise<void> {
    try {
      // Em produção, envia para API
      console.log(`Problema reportado: ${tipo} ${id} - ${problema}`);

      // Em produção:
      // await fetch(`${this.baseUrl}/reportar-problema`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tipo, id, problema, timestamp: new Date().toISOString() })
      // });
    } catch (error) {
      console.error('Erro ao reportar problema:', error);
    }
  }

  /**
   * Verifica se dados precisam ser atualizados
   */
  async verificarAtualizacaoDados(): Promise<{
    direitosAtualizados: boolean;
    farmaciasAtualizadas: boolean;
  }> {
    try {
      // Em produção, verifica versão dos dados
      // const response = await fetch(`${this.baseUrl}/versao-dados`);
      // const versao = await response.json();

      // Simulação para desenvolvimento
      return {
        direitosAtualizados: true,
        farmaciasAtualizadas: true
      };
    } catch (error) {
      console.error('Erro ao verificar atualização:', error);
      return {
        direitosAtualizados: false,
        farmaciasAtualizadas: false
      };
    }
  }
}

export const dadosExternosService = DadosExternosService.getInstance();