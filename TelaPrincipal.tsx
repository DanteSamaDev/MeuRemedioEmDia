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
type Aba = 'medicamentos' | 'direitos' | 'urgencia';

interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  periodo: Periodo;
  horario: string;
  tomado: boolean;
  observacao?: string;
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

const STORAGE_MEDICAMENTOS = '@meu_remedio_em_dia/medicamentos/v1';

const medicamentosBase: Medicamento[] = [
  {
    id: '1',
    nome: 'Losartana',
    dosagem: '1 comprimido',
    periodo: 'manha',
    horario: '08:00',
    tomado: false,
    observacao: 'Tomar após o café da manhã',
  },
  {
    id: '2',
    nome: 'Vitamina D',
    dosagem: '10 gotas',
    periodo: 'manha',
    horario: '09:00',
    tomado: false,
  },
  {
    id: '3',
    nome: 'Omeprazol',
    dosagem: '1 cápsula',
    periodo: 'tarde',
    horario: '13:00',
    tomado: false,
    observacao: 'Tomar 30 minutos antes do almoço',
  },
  {
    id: '4',
    nome: 'Rivotril',
    dosagem: '1/2 comprimido',
    periodo: 'noite',
    horario: '20:00',
    tomado: false,
    observacao: 'Evite álcool',
  },
  {
    id: '5',
    nome: 'Sinvastatina',
    dosagem: '1 comprimido',
    periodo: 'noite',
    horario: '21:00',
    tomado: false,
  },
];

const direitosIniciais: Direito[] = [
  {
    id: 'd1',
    titulo: 'Acesso a medicamentos gratuitos pelo SUS',
    descricao:
      'Quando o medicamento está previsto em protocolos oficiais, você pode solicitar gratuitamente na rede pública.',
    passos: [
      'Peça receita atualizada e laudo médico com CID.',
      'Leve documentos pessoais e comprovante de residência.',
      'Abra solicitação na farmácia de alto custo ou secretaria de saúde.',
    ],
    categoria: 'sus',
  },
  {
    id: 'd2',
    titulo: 'Negativa de fornecimento de medicamento',
    descricao:
      'Se houver negativa, você pode buscar revisão administrativa e apoio da Defensoria Pública.',
    passos: [
      'Solicite a negativa por escrito.',
      'Guarde exames, receita e relatório médico detalhado.',
      'Procure a Defensoria Pública do seu estado para orientação jurídica.',
    ],
    categoria: 'judicial',
  },
  {
    id: 'd3',
    titulo: 'Pedido judicial para cirurgia de urgência',
    descricao:
      'Em situações graves, um defensor/advogado pode pedir liminar para acelerar cirurgia e tratamento.',
    passos: [
      'Tenha relatório médico com indicação de urgência e risco.',
      'Junte exames e histórico clínico recente.',
      'Leve a documentação para atendimento jurídico imediatamente.',
    ],
    categoria: 'judicial',
  },
  {
    id: 'd4',
    titulo: 'Benefícios e isenções relacionadas à saúde',
    descricao:
      'Existem benefícios fiscais e assistenciais em alguns casos. As regras variam por local e perfil.',
    passos: [
      'Verifique regras oficiais da sua cidade/estado.',
      'Guarde notas fiscais, prescrições e laudos.',
      'Busque orientação contábil ou jurídica para cada benefício.',
    ],
    categoria: 'isencao',
  },
];

const acoesRapidas: AcaoRapida[] = [
  {
    id: 'a1',
    titulo: 'SAMU',
    descricao: 'Emergência médica imediata.',
    telefone: '192',
  },
  {
    id: 'a2',
    titulo: 'Disque Saúde',
    descricao: 'Informações oficiais sobre serviços do SUS.',
    telefone: '136',
  },
  {
    id: 'a3',
    titulo: 'Conecte SUS',
    descricao: 'Portal digital de informações e serviços de saúde.',
    url: 'https://www.gov.br/saude/pt-br/assuntos/conecte-sus',
  },
  {
    id: 'a4',
    titulo: 'Defensoria Pública (mapa nacional)',
    descricao: 'Encontrar a Defensoria Pública do seu estado.',
    url: 'https://anadep.org.br/wtk/pagina/membros',
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

const TelaPrincipal: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('medicamentos');
  const [buscaDireitos, setBuscaDireitos] = useState('');
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
    setMedicamentos((prev) =>
      prev.map((medicamento) =>
        medicamento.id === id ? { ...medicamento, tomado: true } : medicamento,
      ),
    );
  };

  const iniciarNovoDia = (): void => {
    Alert.alert('Iniciar novo dia', 'Deseja limpar as marcações de medicamentos tomados?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar marcações',
        style: 'destructive',
        onPress: () => {
          setMedicamentos((prev) => prev.map((medicamento) => ({ ...medicamento, tomado: false })));
        },
      },
    ]);
  };

  const resumoDia = useMemo(() => {
    const total = medicamentos.length;
    const tomados = medicamentos.filter((med) => med.tomado).length;
    const faltam = total - tomados;
    const percentual = total === 0 ? 0 : Math.round((tomados / total) * 100);

    return { total, tomados, faltam, percentual };
  }, [medicamentos]);

  const medicamentosPorPeriodo = (periodo: Periodo): Medicamento[] =>
    medicamentos.filter((med) => med.periodo === periodo);

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

  const ItemMedicamento: React.FC<{ medicamento: Medicamento }> = ({ medicamento }) => (
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

  const SecaoPeriodo: React.FC<{ periodo: Periodo }> = ({ periodo }) => {
    const itens = medicamentosPorPeriodo(periodo);
    const periodoConfig = labelsPeriodo[periodo];

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
        direitosFiltrados.map((direito) => (
          <View
            key={direito.id}
            style={[
              styles.cardDireito,
              { borderLeftColor: coresCategoria[direito.categoria] },
            ]}
          >
            <Text style={styles.tituloDireito}>{direito.titulo}</Text>
            <Text style={styles.descricaoDireito}>{direito.descricao}</Text>
            {direito.passos.map((passo, index) => (
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
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {abaAtiva === 'medicamentos' && renderAbaMedicamentos()}
        {abaAtiva === 'direitos' && renderAbaDireitos()}
        {abaAtiva === 'urgencia' && renderAbaUrgencia()}
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
  barraAbas: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#F3F6FB',
  },
  botaoAba: {
    flex: 1,
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
  textoSemDados: {
    fontSize: 16,
    color: '#627D98',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
});

export default TelaPrincipal;
