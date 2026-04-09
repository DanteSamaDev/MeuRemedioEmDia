import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Periodo = 'manha' | 'tarde' | 'noite';
type Aba = 'medicamentos' | 'direitos' | 'urgencia' | 'farmacias';

interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  periodo: Periodo;
  horario: string;
  tomado: boolean;
  observacao?: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  consumoPorDose: number;
}

interface Direito {
  id: string;
  titulo: string;
  descricao: string;
  passos: string[];
  categoria: 'sus' | 'judicial' | 'isencao';
}

interface AcaoRapida {
  id: string;
  titulo: string;
  descricao: string;
  telefone?: string;
  url?: string;
}

interface FarmaciaConveniada {
  id: string;
  nome: string;
  regiao: string;
  temEntrega: boolean;
  temApp: boolean;
  telefone?: string;
  url?: string;
  observacao: string;
}

const STORAGE_MEDICAMENTOS = '@meu_remedio_em_dia/medicamentos/v2';
const STORAGE_ULTIMO_AVISO_ESTOQUE = '@meu_remedio_em_dia/ultimo_aviso_estoque/v1';

const medicamentosBase: Medicamento[] = [
  {
    id: '1',
    nome: 'Losartana',
    dosagem: '1 comprimido',
    periodo: 'manha',
    horario: '08:00',
    tomado: false,
    observacao: 'Tomar após o café da manhã',
    estoqueAtual: 12,
    estoqueMinimo: 7,
    consumoPorDose: 1,
  },
  {
    id: '2',
    nome: 'Vitamina D',
    dosagem: '10 gotas',
    periodo: 'manha',
    horario: '09:00',
    tomado: false,
    estoqueAtual: 100,
    estoqueMinimo: 30,
    consumoPorDose: 10,
  },
  {
    id: '3',
    nome: 'Omeprazol',
    dosagem: '1 cápsula',
    periodo: 'tarde',
    horario: '13:00',
    tomado: false,
    observacao: 'Tomar 30 minutos antes do almoço',
    estoqueAtual: 8,
    estoqueMinimo: 7,
    consumoPorDose: 1,
  },
  {
    id: '4',
    nome: 'Rivotril',
    dosagem: '1/2 comprimido',
    periodo: 'noite',
    horario: '20:00',
    tomado: false,
    observacao: 'Evite álcool',
    estoqueAtual: 10,
    estoqueMinimo: 6,
    consumoPorDose: 1,
  },
  {
    id: '5',
    nome: 'Sinvastatina',
    dosagem: '1 comprimido',
    periodo: 'noite',
    horario: '21:00',
    tomado: false,
    estoqueAtual: 5,
    estoqueMinimo: 7,
    consumoPorDose: 1,
  },
];

const direitosIniciais: Direito[] = [
  {
    id: 'd1',
    titulo: 'Acesso a medicamentos gratuitos pelo SUS',
    descricao:
      'Medicamentos em protocolos oficiais estão disponíveis gratuitamente na rede pública. Cada estado e município pode ter medicamentos adicionais.',
    passos: [
      'Obtenha receita atualizada com CID e laudo médico detalhado.',
      'Consulte a lista de medicamentos gratuitos do seu estado em gov.br/saude.',
      'Dirija-se à farmácia de alto custo ou secretaria de saúde com documentos pessoais.',
      'Leve comprovante de residência e cartão SUS atualizado.',
      'Solicite o medicamento e aguarde processamento (geralmente 30 dias).',
    ],
    categoria: 'sus',
  },
  {
    id: 'd2',
    titulo: 'Genéricos e similares para economizar',
    descricao:
      'Medicamentos genéricos têm o mesmo efeito que os de marca, custam até 40% menos e estão disponíveis no SUS e farmácias.',
    passos: [
      'Peça ao médico para prescrever pelo princípio ativo ou genérico.',
      'Procure na farmácia pelo nome genérico (ex: "Ato vartastina" em vez de "Arto").',
      'Compare preços entre farmácias - a lei permite consulta de preços.',
      'Verifique programas de farmácia de genéricos com desconto.',
      'Combine genéricos com programas de fidelidade para mais economia.',
    ],
    categoria: 'sus',
  },
  {
    id: 'd3',
    titulo: 'Cirurgias eletivas e procedimentos gratuitos pelo SUS',
    descricao:
      'Cirurgias, exames e procedimentos estão disponíveis gratuitamente. O tempo de espera pode variar de alguns meses a anos, mas você tem direito.',
    passos: [
      'Consulte seu médico e solicite encaminhamento para especialista pelo SUS.',
      'Se urgente ou emergência, dirija-se ao hospital de referência.',
      'Para procedimentos eletivos, solicite inscrição na fila de espera.',
      'Monitore seu status pelo app ConnectSUS (gov.br).',
      'Se o tempo de espera for prejudicial à saúde, procure Defensoria Pública.',
    ],
    categoria: 'judicial',
  },
  {
    id: 'd4',
    titulo: 'Negativa de medicamento ou procedimento - seus direitos',
    descricao:
      'Se o SUS ou sua operadora de saúde negar um medicamento ou procedimento prescrito, você tem direito a contestar.',
    passos: [
      'Solicite a negativa por escrito (exija documento formal).',
      'Reúna receita médica, exames, laudos e relatório detalhado.',
      'Procure a Defensoria Pública do seu estado (atendimento gratuito).',
      'Defensor pode pedir liminar (decisão rápida) na Justiça.',
      'Em casos críticos, a Justiça pode obrigar fornecimento em 24-48h.',
    ],
    categoria: 'judicial',
  },
  {
    id: 'd5',
    titulo: 'Ação judicial para medicamento ou cirurgia (direitos judiciais)',
    descricao:
      'Quando esgotados recursos administrativos, você pode pedir ajuda jurídica para garantir tratamento. A Lei 8.080/90 garante saúde como direito constitucional.',
    passos: [
      'Tenha relatório médico comprovando necessidade urgente.',
      'Documente todas as tentativas de obter o medicamento/procedimento pelo SUS.',
      'Procure Defensoria Pública ou ONG jurídica de saúde (primeira consulta grátis).',
      'Defensor entrará com ação na Justiça Federal ou Estadual.',
      'Muitas ações conseguem liminar (tutela de urgência) em poucos dias.',
    ],
    categoria: 'judicial',
  },
  {
    id: 'd6',
    titulo: 'Isenção de impostos em medicamentos e equipamentos',
    descricao:
      'Pacientes com doenças crônicas, deficiência ou idosos podem ter direito a isenção de ICMS e PIS em medicamentos e equipamentos. Regras variam por estado.',
    passos: [
      'Verifique se sua doença/condição está na lista de isenção do seu estado.',
      'Reúna laudos médicos, prescrição e comprovante de residência.',
      'Solicite certificado de isenção na Secretaria de Fazenda do seu estado.',
      'Apresente certificado à farmácia para compras com isenção.',
      'Alguns estados permitem solicitar reembolso de compras anteriores.',
    ],
    categoria: 'isencao',
  },
  {
    id: 'd7',
    titulo: 'Tratamento gratuito em instituições filantrópicas e ONGs',
    descricao:
      'Existem hospitais, clínicas e ONGs que oferecem atendimento médico, cirurgias e medicamentos gratuitos. Encontre próximo a você.',
    passos: [
      'Busque no site gov.br/saude por "Santa Casa" ou "Hospital Filantrópico" da sua região.',
      'Procure ONGs especializadas na sua doença (ex: APAC para câncer, ADA para diabetes).',
      'Ligue para instituições próximas e pergunte sobre programas gratuitos.',
      'Leve RG, CPF, comprovante de residência e receita médica.',
      'Informe sua renda para verificar se tem direito a atendimento gratuito.',
    ],
    categoria: 'sus',
  },
];

const acoesRapidas: AcaoRapida[] = [
  {
    id: 'a1',
    titulo: 'SAMU - Emergência',
    descricao: 'Chamada de ambulância e resgate para emergências médicas.',
    telefone: '192',
  },
  {
    id: 'a2',
    titulo: 'Bombeiros - Resgate',
    descricao: 'Para situações que envolvam resgate ou incêndio.',
    telefone: '193',
  },
  {
    id: 'a3',
    titulo: 'Disque Saúde',
    descricao: 'Informações 24h sobre saúde pública, SUS e orientações médicas.',
    telefone: '136',
  },
  {
    id: 'a4',
    titulo: 'Central de Atendimento SUS',
    descricao: 'Agendamento de consultas e informações sobre serviços do SUS.',
    telefone: '135',
  },
  {
    id: 'a5',
    titulo: 'Conecte SUS',
    descricao: 'Portal com histórico médico, marcações e informações de saúde.',
    url: 'https://www.gov.br/saude/pt-br/assuntos/conecte-sus',
  },
  {
    id: 'a6',
    titulo: 'Defensoria Pública',
    descricao: 'Atendimento jurídico gratuito - encontre a de sua região.',
    url: 'https://anadep.org.br/wtk/pagina/membros',
  },
  {
    id: 'a7',
    titulo: 'Ministério Público Federal (Saúde)',
    descricao: 'Defesa de direitos coletivos em saúde e medicamentos.',
    url: 'https://www.mpf.mp.br',
  },
  {
    id: 'a8',
    titulo: 'Anvisa - Medicamentos',
    descricao: 'Consulte medicamentos autorizados e alertas de segurança.',
    url: 'https://consultas.anvisa.gov.br/#/medicamentos/',
  },
  {
    id: 'a9',
    titulo: 'TabaiUna - Portal de Medicamentos SUS',
    descricao: 'Consulte medicamentos gratuitos do SUS por estado.',
    url: 'https://tabaiana.saude.rs.gov.br/',
  },
];

const farmaciasConveniadasBase: FarmaciaConveniada[] = [
  {
    id: 'f1',
    nome: 'Drogasil',
    regiao: 'Nacional',
    temEntrega: true,
    temApp: true,
    telefone: '3004-8007',
    url: 'https://www.drogasil.com.br/',
    observacao: 'Oferece genéricos com desconto e programa de fidelidade.',
  },
  {
    id: 'f2',
    nome: 'Drogaria São Paulo',
    regiao: 'Sudeste e Centro-Oeste',
    temEntrega: true,
    temApp: true,
    telefone: '4003-3393',
    url: 'https://www.drogariasaopaulo.com.br/',
    observacao: 'Atendimento presencial e delivery em principais cidades.',
  },
  {
    id: 'f3',
    nome: 'Pague Menos',
    regiao: 'Nacional',
    temEntrega: true,
    temApp: true,
    telefone: '0800-275-1313',
    url: 'https://www.paguemenos.com.br/',
    observacao: 'Programa de genéricos com até 50% desconto.',
  },
  {
    id: 'f4',
    nome: 'Farmácia Real',
    regiao: 'Nordeste e Norte',
    temEntrega: true,
    temApp: true,
    telefone: '0800-707-2700',
    url: 'https://www.farmariareal.com.br',
    observacao: 'Medicamentos genéricos e manipulação.',
  },
  {
    id: 'f5',
    nome: 'Farmácia Associada',
    regiao: 'Sul e Centro-Oeste',
    temEntrega: true,
    temApp: false,
    telefone: '0800-228-8888',
    url: 'https://www.farmaciassociadabr.com.br',
    observacao: 'Rede de farmácias independentes com bom preço.',
  },
  {
    id: 'f6',
    nome: 'Manipuladoras & Genéricos',
    regiao: 'Nacional',
    temEntrega: false,
    temApp: false,
    observacao: 'Busque farmácias de manipulação em sua cidade - medicamentos mais baratos.',
  },
  {
    id: 'f7',
    nome: 'Medicamentos Genéricos - Governo',
    regiao: 'Nacional (SUS)',
    temEntrega: false,
    temApp: true,
    url: 'https://www.gov.br/saude/pt-br',
    observacao: 'Medicamentos 100% gratuitos pelo SUS em farmácias públicas.',
  },
  {
    id: 'f8',
    nome: 'Programa Farmácia Popular',
    regiao: 'Nacional',
    temEntrega: false,
    temApp: false,
    url: 'https://www.gov.br/cidadania/pt-br/acoes-e-programas/farmacia-popular',
    observacao: 'Medicamentos com preços reduzidos em farmácias conveniadas.',
  },
];

const coresCategoria: Record<Direito['categoria'], string> = {
  sus: '#0B74DE',
  judicial: '#7A2CF2',
  isencao: '#00A676',
};

const labelsPeriodo: Record<Periodo, { titulo: string; icone: string }> = {
  manha: { titulo: 'Manhã', icone: '☀️' },
  tarde: { titulo: 'Tarde', icone: '☕' },
  noite: { titulo: 'Noite', icone: '🌙' },
};

const calcularDiasRestantes = (medicamento: Medicamento): number => {
  if (medicamento.consumoPorDose <= 0) {
    return 999;
  }
  return Math.floor(medicamento.estoqueAtual / medicamento.consumoPorDose);
};

const TelaPrincipal: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('medicamentos');
  const [buscaDireitos, setBuscaDireitos] = useState('');
  const [buscaFarmacia, setBuscaFarmacia] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(medicamentosBase);

  useEffect(() => {
    const carregarMedicamentos = async (): Promise<void> => {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_MEDICAMENTOS);
        if (dadosSalvos) {
          const parsed = JSON.parse(dadosSalvos) as Medicamento[];
          setMedicamentos(parsed);
        }
      } catch {
        Alert.alert(
          'Aviso',
          'Não foi possível carregar os dados locais. O app continuará com dados padrão.',
        );
      } finally {
        setCarregando(false);
      }
    };

    void carregarMedicamentos();
  }, []);

  useEffect(() => {
    if (carregando) {
      return;
    }

    const persistirMedicamentos = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_MEDICAMENTOS, JSON.stringify(medicamentos));
      } catch {
        Alert.alert('Aviso', 'Não foi possível salvar os dados localmente.');
      }
    };

    void persistirMedicamentos();
  }, [carregando, medicamentos]);

  const estoqueCritico = useMemo(
    () =>
      medicamentos
        .filter((med: Medicamento) => calcularDiasRestantes(med) <= med.estoqueMinimo)
        .sort((a: Medicamento, b: Medicamento) => calcularDiasRestantes(a) - calcularDiasRestantes(b)),
    [medicamentos],
  );

  useEffect(() => {
    const avisarEstoqueBaixo = async (): Promise<void> => {
      if (!estoqueCritico.length) {
        return;
      }

      const hoje = new Date().toISOString().slice(0, 10);
      const ultimaDataAviso = await AsyncStorage.getItem(STORAGE_ULTIMO_AVISO_ESTOQUE);

      if (ultimaDataAviso === hoje) {
        return;
      }

      const primeiro = estoqueCritico[0];
      Alert.alert(
        'Atenção: estoque baixo',
        `${primeiro.nome} está próximo do fim. Abra a aba Farmácias para ver opções de compra e entrega.`,
      );
      await AsyncStorage.setItem(STORAGE_ULTIMO_AVISO_ESTOQUE, hoje);
    };

    if (!carregando) {
      void avisarEstoqueBaixo();
    }
  }, [carregando, estoqueCritico]);

  const obterDataAtual = (): string => {
    const hoje = new Date();
    const opcoes: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return `Hoje, ${hoje.toLocaleDateString('pt-BR', opcoes)}`;
  };

  const marcarComoTomado = (id: string): void => {
    setMedicamentos((prev: Medicamento[]) =>
      prev.map((medicamento: Medicamento) => {
        if (medicamento.id !== id) {
          return medicamento;
        }

        const novoEstoque = Math.max(
          0,
          medicamento.estoqueAtual - medicamento.consumoPorDose,
        );

        return {
          ...medicamento,
          tomado: true,
          estoqueAtual: novoEstoque,
        };
      }),
    );
  };

  const iniciarNovoDia = (): void => {
    Alert.alert('Iniciar novo dia', 'Deseja limpar as marcações de medicamentos tomados?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar marcações',
        style: 'destructive',
        onPress: () => {
          setMedicamentos((prev: Medicamento[]) =>
            prev.map((medicamento: Medicamento) => ({ ...medicamento, tomado: false })),
          );
        },
      },
    ]);
  };

  const resumoDia = useMemo(() => {
    const total = medicamentos.length;
    const tomados = medicamentos.filter((med: Medicamento) => med.tomado).length;
    const faltam = total - tomados;
    const percentual = total === 0 ? 0 : Math.round((tomados / total) * 100);

    return { total, tomados, faltam, percentual };
  }, [medicamentos]);

  const medicamentosPorPeriodo = (periodo: Periodo): Medicamento[] =>
    medicamentos.filter((med: Medicamento) => med.periodo === periodo);

  const direitosFiltrados = useMemo(() => {
    if (!buscaDireitos.trim()) {
      return direitosIniciais;
    }

    const termo = buscaDireitos.toLowerCase();
    return direitosIniciais.filter(
      (item) =>
        item.titulo.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo) ||
        item.passos.some((passo) => passo.toLowerCase().includes(termo)),
    );
  }, [buscaDireitos]);

  const farmaciasFiltradas = useMemo(() => {
    if (!buscaFarmacia.trim()) {
      return farmaciasConveniadasBase;
    }

    const termo = buscaFarmacia.toLowerCase();
    return farmaciasConveniadasBase.filter(
      (item) =>
        item.nome.toLowerCase().includes(termo) ||
        item.regiao.toLowerCase().includes(termo) ||
        item.observacao.toLowerCase().includes(termo),
    );
  }, [buscaFarmacia]);

  const abrirAcaoRapida = async (acao: AcaoRapida): Promise<void> => {
    const destino = acao.telefone ? `tel:${acao.telefone}` : acao.url;
    if (!destino) {
      return;
    }

    try {
      const podeAbrir = await Linking.canOpenURL(destino);
      if (podeAbrir) {
        await Linking.openURL(destino);
      } else {
        Alert.alert('Não foi possível abrir', 'Verifique se o seu aparelho suporta essa ação.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir este recurso no momento.');
    }
  };

  const abrirFarmacia = async (farmacia: FarmaciaConveniada): Promise<void> => {
    const destino = farmacia.url ?? (farmacia.telefone ? `tel:${farmacia.telefone}` : null);
    if (!destino) {
      Alert.alert('Sem contato disponível', 'Esta farmácia ainda não possui contato cadastrado.');
      return;
    }

    try {
      const podeAbrir = await Linking.canOpenURL(destino);
      if (podeAbrir) {
        await Linking.openURL(destino);
      } else {
        Alert.alert('Não foi possível abrir', 'Verifique se o seu aparelho suporta essa ação.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir este recurso no momento.');
    }
  };

  const ItemMedicamento: React.FC<{ medicamento: Medicamento }> = ({ medicamento }: { medicamento: Medicamento }) => {
    const diasRestantes = calcularDiasRestantes(medicamento);
    const estoqueBaixo = diasRestantes <= medicamento.estoqueMinimo;

    return (
      <View
        style={[
          styles.itemMedicamento,
          medicamento.tomado && styles.itemMedicamentoTomado,
        ]}
      >
        <View style={styles.infoMedicamento}>
          <Text style={[styles.nomeMedicamento, medicamento.tomado && styles.textoTomado]}>
            {medicamento.nome}
          </Text>
          <Text style={[styles.dosagemMedicamento, medicamento.tomado && styles.textoTomado]}>
            {medicamento.dosagem} · {medicamento.horario}
          </Text>
          <Text style={[styles.estoqueMedicamento, estoqueBaixo && styles.estoqueCriticoTexto]}>
            Estoque: {medicamento.estoqueAtual} unidades · aprox. {diasRestantes} dias restantes
          </Text>
          {medicamento.observacao ? (
            <Text style={styles.observacaoMedicamento}>{medicamento.observacao}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.botaoTomado, medicamento.tomado && styles.botaoJaTomado]}
          onPress={() => marcarComoTomado(medicamento.id)}
          disabled={medicamento.tomado}
          accessibilityRole="button"
          accessibilityLabel={
            medicamento.tomado
              ? `${medicamento.nome} já foi tomado`
              : `Marcar ${medicamento.nome} como tomado`
          }
        >
          <Text style={styles.textoBotaoTomado}>
            {medicamento.tomado ? 'Tomado' : 'Já tomei'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const SecaoPeriodo: React.FC<{ periodo: Periodo }> = ({ periodo }: { periodo: Periodo }) => {
    const itens = medicamentosPorPeriodo(periodo);
    const periodoConfig = labelsPeriodo[periodo as Periodo];

    return (
      <View style={styles.secaoPeriodo}>
        <View style={styles.cabecalhoPeriodo}>
          <Text style={styles.iconePeriodo}>{periodoConfig.icone}</Text>
          <Text style={styles.tituloPeriodo}>{periodoConfig.titulo}</Text>
          <Text style={styles.quantidadePeriodo}>{itens.length}</Text>
        </View>

        {itens.length === 0 ? (
          <Text style={styles.textoSemDados}>Nenhum remédio nesse período.</Text>
        ) : (
          itens.map((medicamento) => (
            <ItemMedicamento key={medicamento.id} medicamento={medicamento} />
          ))
        )}
      </View>
    );
  };

  const renderAbaMedicamentos = () => (
    <>
      <View style={styles.cartaoResumo}>
        <Text style={styles.tituloResumo}>Resumo do dia</Text>
        <Text style={styles.textoResumo}>Tomados: {resumoDia.tomados}</Text>
        <Text style={styles.textoResumo}>Faltam: {resumoDia.faltam}</Text>
        <View style={styles.barraProgressoContainer}>
          <View style={[styles.barraProgressoFill, { width: `${resumoDia.percentual}%` }]} />
        </View>
        <Text style={styles.porcentagemProgresso}>{resumoDia.percentual}% concluído</Text>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={iniciarNovoDia}
          accessibilityRole="button"
          accessibilityLabel="Limpar marcações de remédios tomados"
        >
          <Text style={styles.textoBotaoSecundario}>Iniciar novo dia</Text>
        </TouchableOpacity>
      </View>

      {estoqueCritico.length > 0 ? (
        <View style={styles.alertaEstoqueCard}>
          <Text style={styles.alertaEstoqueTitulo}>⚠️ Remédios perto do fim</Text>
          {estoqueCritico.slice(0, 3).map((med: Medicamento) => (
            <Text key={`alerta-${med.id}`} style={styles.alertaEstoqueTexto}>
              • {med.nome}: aprox. {calcularDiasRestantes(med)} dias restantes.
            </Text>
          ))}
          <Text style={styles.alertaEstoqueTexto}>
            Vá para a aba "Farmácias" para verificar opções conveniadas.
          </Text>
        </View>
      ) : null}

      <SecaoPeriodo periodo="manha" />
      <SecaoPeriodo periodo="tarde" />
      <SecaoPeriodo periodo="noite" />
    </>
  );

  const renderAbaDireitos = () => (
    <View style={styles.blocoConteudo}>
      <Text style={styles.tituloSecao}>Portal de Direitos em Saúde</Text>
      <Text style={styles.textoAuxiliar}>
        Conteúdo educativo para orientar pacientes e familiares. Não substitui orientação
        jurídica ou médica profissional.
      </Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar por remédio, cirurgia, SUS..."
        placeholderTextColor="#6E6E6E"
        value={buscaDireitos}
        onChangeText={setBuscaDireitos}
        accessibilityLabel="Campo de busca de direitos"
      />

      {direitosFiltrados.length === 0 ? (
        <Text style={styles.textoSemDados}>Nenhum tema encontrado para sua busca.</Text>
      ) : (
        direitosFiltrados.map((direito: Direito) => (
          <View
            key={direito.id}
            style={[
              styles.cardDireito,
              { borderLeftColor: coresCategoria[direito.categoria] },
            ]}
          >
            <Text style={styles.tituloDireito}>{direito.titulo}</Text>
            <Text style={styles.descricaoDireito}>{direito.descricao}</Text>
            {direito.passos.map((passo: string, index: number) => (
              <Text key={`${direito.id}-${index}`} style={styles.passoDireito}>
                {index + 1}. {passo}
              </Text>
            ))}
          </View>
        ))
      )}
    </View>
  );

  const renderAbaUrgencia = () => (
    <View style={styles.blocoConteudo}>
      <Text style={styles.tituloSecao}>Urgência: passos rápidos</Text>
      <Text style={styles.textoAuxiliar}>
        Em risco iminente de vida, acione emergência imediatamente. Para pedidos judiciais,
        reúna documentos e procure atendimento jurídico.
      </Text>

      <View style={styles.cardChecklist}>
        <Text style={styles.tituloChecklist}>Checklist de documentos</Text>
        <Text style={styles.itemChecklist}>• Documento com foto e CPF.</Text>
        <Text style={styles.itemChecklist}>• Cartão SUS (se tiver).</Text>
        <Text style={styles.itemChecklist}>• Receita e relatório médico com urgência.</Text>
        <Text style={styles.itemChecklist}>• Exames e negativa formal do atendimento (se houver).</Text>
      </View>

      {acoesRapidas.map((acao) => (
        <TouchableOpacity
          key={acao.id}
          style={styles.botaoAcaoRapida}
          onPress={() => {
            void abrirAcaoRapida(acao);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Abrir ${acao.titulo}`}
        >
          <View style={styles.infoAcaoRapida}>
            <Text style={styles.tituloAcaoRapida}>{acao.titulo}</Text>
            <Text style={styles.descricaoAcaoRapida}>{acao.descricao}</Text>
            {acao.telefone ? (
              <Text style={styles.contatoAcaoRapida}>Telefone: {acao.telefone}</Text>
            ) : null}
          </View>
          <Text style={styles.textoAbrirAcao}>Abrir</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAbaFarmacias = () => (
    <View style={styles.blocoConteudo}>
      <Text style={styles.tituloSecao}>Farmácias conveniadas e delivery</Text>
      <Text style={styles.textoAuxiliar}>
        Aqui você pode consultar farmácias com app, entrega e canais de compra.
      </Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar por farmácia ou região"
        placeholderTextColor="#6E6E6E"
        value={buscaFarmacia}
        onChangeText={setBuscaFarmacia}
        accessibilityLabel="Campo de busca de farmácias"
      />

      {farmaciasFiltradas.length === 0 ? (
        <Text style={styles.textoSemDados}>Nenhuma farmácia encontrada.</Text>
      ) : (
        farmaciasFiltradas.map((farmacia: FarmaciaConveniada) => (
          <View key={farmacia.id} style={styles.cardFarmacia}>
            <Text style={styles.tituloFarmacia}>{farmacia.nome}</Text>
            <Text style={styles.itemFarmacia}>Região: {farmacia.regiao}</Text>
            <Text style={styles.itemFarmacia}>
              App: {farmacia.temApp ? 'Sim' : 'Não'} · Entrega: {farmacia.temEntrega ? 'Sim' : 'Não'}
            </Text>
            <Text style={styles.itemFarmacia}>{farmacia.observacao}</Text>
            {farmacia.telefone ? (
              <Text style={styles.itemFarmacia}>Telefone: {farmacia.telefone}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.botaoFarmacia}
              onPress={() => {
                void abrirFarmacia(farmacia);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Abrir contato de ${farmacia.nome}`}
            >
              <Text style={styles.textoBotaoFarmacia}>Abrir contato</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  if (carregando) {
    return (
      <SafeAreaView style={styles.containerCarregando}>
        <StatusBar barStyle="dark-content" backgroundColor="#F3F6FB" />
        <Text style={styles.textoCarregando}>Carregando seus dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6FB" />

      <View style={styles.cabecalho}>
        <Text style={styles.dataAtual}>{obterDataAtual()}</Text>
        <Text style={styles.subtitulo}>Saúde, direitos e cuidado em um só lugar</Text>
        <Text style={styles.textoPrivacidade}>
          Dados salvos localmente no aparelho. Futuro banco online poderá ser opcional.
        </Text>
      </View>

      <View style={styles.barraAbas}>
        <TouchableOpacity
          style={[styles.botaoAba, abaAtiva === 'medicamentos' && styles.botaoAbaAtivo]}
          onPress={() => setAbaAtiva('medicamentos')}
          accessibilityRole="button"
        >
          <Text style={[styles.textoAba, abaAtiva === 'medicamentos' && styles.textoAbaAtivo]}>
            Remédios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoAba, abaAtiva === 'direitos' && styles.botaoAbaAtivo]}
          onPress={() => setAbaAtiva('direitos')}
          accessibilityRole="button"
        >
          <Text style={[styles.textoAba, abaAtiva === 'direitos' && styles.textoAbaAtivo]}>
            Direitos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoAba, abaAtiva === 'urgencia' && styles.botaoAbaAtivo]}
          onPress={() => setAbaAtiva('urgencia')}
          accessibilityRole="button"
        >
          <Text style={[styles.textoAba, abaAtiva === 'urgencia' && styles.textoAbaAtivo]}>
            Urgência
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoAba, abaAtiva === 'farmacias' && styles.botaoAbaAtivo]}
          onPress={() => setAbaAtiva('farmacias')}
          accessibilityRole="button"
        >
          <Text style={[styles.textoAba, abaAtiva === 'farmacias' && styles.textoAbaAtivo]}>
            Farmácias
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {abaAtiva === 'medicamentos' && renderAbaMedicamentos()}
        {abaAtiva === 'direitos' && renderAbaDireitos()}
        {abaAtiva === 'urgencia' && renderAbaUrgencia()}
        {abaAtiva === 'farmacias' && renderAbaFarmacias()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  containerCarregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6FB',
    padding: 20,
  },
  textoCarregando: {
    fontSize: 20,
    color: '#243B53',
    textAlign: 'center',
    lineHeight: 28,
  },
  cabecalho: {
    backgroundColor: '#F3F6FB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D9E2EF',
  },
  dataAtual: {
    fontSize: 24,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 17,
    color: '#486581',
    lineHeight: 24,
  },
  textoPrivacidade: {
    marginTop: 6,
    fontSize: 14,
    color: '#627D98',
    lineHeight: 20,
  },
  barraAbas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#F3F6FB',
  },
  botaoAba: {
    minWidth: '47%',
    flexGrow: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD2D9',
  },
  botaoAbaAtivo: {
    backgroundColor: '#0B74DE',
    borderColor: '#0B74DE',
  },
  textoAba: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334E68',
  },
  textoAbaAtivo: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  cartaoResumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D9E2EF',
  },
  tituloResumo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 8,
  },
  textoResumo: {
    fontSize: 18,
    color: '#334E68',
    marginBottom: 4,
  },
  barraProgressoContainer: {
    marginTop: 10,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#E4E7EB',
    overflow: 'hidden',
  },
  barraProgressoFill: {
    height: '100%',
    backgroundColor: '#00A676',
    borderRadius: 999,
  },
  porcentagemProgresso: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#243B53',
  },
  botaoSecundario: {
    marginTop: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0B74DE',
    borderRadius: 12,
  },
  textoBotaoSecundario: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B74DE',
  },
  alertaEstoqueCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#F8B4B4',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  alertaEstoqueTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9B1C1C',
    marginBottom: 6,
  },
  alertaEstoqueTexto: {
    fontSize: 15,
    color: '#742A2A',
    lineHeight: 22,
  },
  secaoPeriodo: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D9E2EF',
  },
  cabecalhoPeriodo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconePeriodo: {
    fontSize: 24,
    marginRight: 8,
  },
  tituloPeriodo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#102A43',
    flex: 1,
  },
  quantidadePeriodo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#486581',
    backgroundColor: '#E6EEF8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  itemMedicamento: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EF',
    padding: 12,
    marginBottom: 10,
  },
  itemMedicamentoTomado: {
    opacity: 0.72,
  },
  infoMedicamento: {
    marginBottom: 12,
  },
  nomeMedicamento: {
    fontSize: 21,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 3,
  },
  dosagemMedicamento: {
    fontSize: 17,
    color: '#334E68',
    marginBottom: 4,
  },
  estoqueMedicamento: {
    fontSize: 15,
    color: '#486581',
    marginBottom: 4,
  },
  estoqueCriticoTexto: {
    color: '#B42318',
    fontWeight: '700',
  },
  observacaoMedicamento: {
    fontSize: 15,
    color: '#627D98',
  },
  textoTomado: {
    textDecorationLine: 'line-through',
    color: '#627D98',
  },
  botaoTomado: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#0B74DE',
    paddingVertical: 14,
  },
  botaoJaTomado: {
    backgroundColor: '#00A676',
  },
  textoBotaoTomado: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  blocoConteudo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9E2EF',
    padding: 14,
  },
  tituloSecao: {
    fontSize: 24,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 8,
  },
  textoAuxiliar: {
    fontSize: 16,
    color: '#486581',
    lineHeight: 24,
    marginBottom: 12,
  },
  inputBusca: {
    minHeight: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#BCCCDC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#102A43',
    marginBottom: 12,
  },
  cardDireito: {
    borderWidth: 1,
    borderColor: '#D9E2EF',
    borderLeftWidth: 6,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  tituloDireito: {
    fontSize: 19,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 6,
  },
  descricaoDireito: {
    fontSize: 16,
    color: '#334E68',
    marginBottom: 8,
    lineHeight: 24,
  },
  passoDireito: {
    fontSize: 16,
    color: '#243B53',
    marginBottom: 4,
    lineHeight: 24,
  },
  cardChecklist: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EF',
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginBottom: 12,
  },
  tituloChecklist: {
    fontSize: 20,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 8,
  },
  itemChecklist: {
    fontSize: 16,
    color: '#334E68',
    marginBottom: 4,
    lineHeight: 24,
  },
  botaoAcaoRapida: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EF',
    padding: 12,
    marginBottom: 10,
    minHeight: 64,
    backgroundColor: '#FFFFFF',
  },
  infoAcaoRapida: {
    flex: 1,
    paddingRight: 10,
  },
  tituloAcaoRapida: {
    fontSize: 19,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 3,
  },
  descricaoAcaoRapida: {
    fontSize: 16,
    color: '#486581',
    marginBottom: 4,
  },
  contatoAcaoRapida: {
    fontSize: 15,
    color: '#334E68',
  },
  textoAbrirAcao: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B74DE',
  },
  cardFarmacia: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EF',
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginBottom: 10,
  },
  tituloFarmacia: {
    fontSize: 19,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 6,
  },
  itemFarmacia: {
    fontSize: 15,
    color: '#334E68',
    marginBottom: 4,
    lineHeight: 21,
  },
  botaoFarmacia: {
    marginTop: 8,
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: '#0B74DE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  textoBotaoFarmacia: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textoSemDados: {
    fontSize: 16,
    color: '#627D98',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
});

export default TelaPrincipal;
