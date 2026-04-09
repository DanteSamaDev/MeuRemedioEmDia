import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAutenticacao } from '../context/AutenticacaoContext';
import { useTema } from '../context/TemaContext';

const { width } = Dimensions.get('window');
const TAMANHO_BOTAO = (width - 50) / 3;

type ModoTela = 'login' | 'cadastro' | 'confirmar';

interface TelaPINProps {
  onAutenticacao?: () => void;
}

export function TelaPIN({ onAutenticacao }: TelaPINProps): React.JSX.Element {
  const { cores } = useTema();
  const {
    autenticado,
    pinConfigurable,
    autenticarComPin,
    definirPin,
    apagarPin,
  } = useAutenticacao();

  // Estados
  const [modo, setModo] = useState<ModoTela>(() => {
    if (autenticado) return 'login';
    if (pinConfigurable) return 'cadastro';
    return 'login';
  });

  const [pin, setPin] = useState('');
  const [pinConfirmacao, setPinConfirmacao] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tempoDesbloqueio, setTempoDesbloqueio] = useState(0);

  // Timer para desbloqueio
  useEffect(() => {
    if (!bloqueado || tempoDesbloqueio <= 0) return;

    const intervalo = setInterval(() => {
      setTempoDesbloqueio((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [bloqueado, tempoDesbloqueio]);

  useEffect(() => {
    if (tempoDesbloqueio === 0 && bloqueado) {
      setBloqueado(false);
      setTentativas(0);
    }
  }, [tempoDesbloqueio, bloqueado]);

  // Handlers
  const adicionarDigito = (digito: string) => {
    if (bloqueado) {
      Alert.alert(
        'Acesso Bloqueado',
        `Tente novamente em ${tempoDesbloqueio} segundos`
      );
      return;
    }

    if (modo === 'confirmar') {
      if (pinConfirmacao.length < 6) {
        setPinConfirmacao(pinConfirmacao + digito);
      }
    } else {
      if (pin.length < 6) {
        setPin(pin + digito);
      }
    }
  };

  const removerDigito = () => {
    if (modo === 'confirmar') {
      setPinConfirmacao(pinConfirmacao.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  const limparTudo = () => {
    setPin('');
    setPinConfirmacao('');
    setModo('login');
  };

  const validarPin = (): boolean => {
    if (!pin) {
      Alert.alert('PIN obrigatório', 'Digite seu PIN');
      return false;
    }
    if (pin.length < 4) {
      Alert.alert('PIN inválido', 'Mínimo 4 dígitos');
      return false;
    }
    return true;
  };

  const handleAutenticar = async () => {
    if (!validarPin()) return;

    const sucesso = await autenticarComPin(pin);

    if (sucesso) {
      setPin('');
      setTentativas(0);
      onAutenticacao?.();
    } else {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);

      if (novasTentativas >= 5) {
        setBloqueado(true);
        setTempoDesbloqueio(300); // 5 minutos
        Alert.alert(
          'Acesso Bloqueado',
          'Muitas tentativas incorretas. Tente novamente em 5 minutos.'
        );
      } else {
        Alert.alert(
          'PIN Incorreto',
          `Tentativas restantes: ${5 - novasTentativas}`
        );
      }
      setPin('');
    }
  };

  const handleCadastrar = async () => {
    if (!validarPin()) return;

    if (pin.length < 4 || pin.length > 6) {
      Alert.alert('PIN inválido', 'Use entre 4 e 6 dígitos');
      return;
    }

    setModo('confirmar');
  };

  const handleConfirmar = async () => {
    if (pin !== pinConfirmacao) {
      Alert.alert('PINs não conferem', 'Digite o mesmo PIN nos dois campos');
      setPinConfirmacao('');
      return;
    }

    try {
      await definirPin(pin);
      Alert.alert('Sucesso', 'PIN cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setPin('');
            setPinConfirmacao('');
            setModo('login');
          },
        },
      ]);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível cadastrar o PIN');
    }
  };

  const handleConfirmarPin = () => {
    if (modo === 'login') {
      handleAutenticar();
    } else if (modo === 'cadastro') {
      handleCadastrar();
    } else {
      handleConfirmar();
    }
  };

  const getTitulo = (): string => {
    switch (modo) {
      case 'login':
        return 'Faça Login com PIN';
      case 'cadastro':
        return 'Crie seu PIN';
      case 'confirmar':
        return 'Confirme o PIN';
    }
  };

  const getSubtitulo = (): string => {
    switch (modo) {
      case 'login':
        return `${pin.length}/6 dígitos`;
      case 'cadastro':
        return `${pin.length}/6 dígitos (mín. 4)`;
      case 'confirmar':
        return `${pinConfirmacao.length}/6 dígitos`;
    }
  };

  const pinAtual = modo === 'confirmar' ? pinConfirmacao : pin;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: cores.fundo }]}
    >
      <View style={styles.conteudo}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.titulo, { color: cores.texto }]}>
            {getTitulo()}
          </Text>
          <Text style={[styles.subtitulo, { color: cores.textoSecundario }]}>
            {getSubtitulo()}
          </Text>
        </View>

        {/* Display PIN */}
        <View style={styles.displayPIN}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <View
              key={index}
              style={[
                styles.circuloPin,
                {
                  backgroundColor:
                    index < pinAtual.length ? cores.primaria : cores.fundo2,
                  borderColor: cores.primaria,
                },
              ]}
            />
          ))}
        </View>

        {/* Mensagem de Status */}
        {bloqueado && (
          <View
            style={[
              styles.mensagemStatus,
              { backgroundColor: cores.erro + '20', borderColor: cores.erro },
            ]}
          >
            <Text style={[styles.textoStatus, { color: cores.erro }]}>
              ⏳ Bloqueado por {tempoDesbloqueio}s
            </Text>
          </View>
        )}

        {tentativas > 0 && !bloqueado && (
          <View
            style={[
              styles.mensagemStatus,
              { backgroundColor: cores.aviso + '20', borderColor: cores.aviso },
            ]}
          >
            <Text style={[styles.textoStatus, { color: cores.aviso }]}>
              ⚠️ {5 - tentativas} tentativa{5 - tentativas !== 1 ? 's' : ''} restante
            </Text>
          </View>
        )}

        {/* Teclado Numérico */}
        <View style={styles.teclado}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.botaoDigito,
                {
                  backgroundColor: cores.fundo2,
                  borderColor: cores.primaria,
                },
              ]}
              onPress={() => adicionarDigito(num.toString())}
              disabled={bloqueado}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.textoDigito,
                  { color: cores.texto, opacity: bloqueado ? 0.5 : 1 },
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Botão 0 (centralizado) */}
          <TouchableOpacity
            style={[styles.botaoZero, { width: TAMANHO_BOTAO }]}
            disabled={true}
          />

          <TouchableOpacity
            style={[
              styles.botaoDigito,
              {
                backgroundColor: cores.fundo2,
                borderColor: cores.primaria,
              },
            ]}
            onPress={() => adicionarDigito('0')}
            disabled={bloqueado}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.textoDigito,
                { color: cores.texto, opacity: bloqueado ? 0.5 : 1 },
              ]}
            >
              0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoZero, { width: TAMANHO_BOTAO }]}
            disabled={true}
          />
        </View>

        {/* Botões de Ação */}
        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={[
              styles.botaoAcao,
              {
                backgroundColor: cores.fundo2,
                borderColor: cores.primaria,
              },
            ]}
            onPress={removerDigito}
            disabled={bloqueado || pinAtual.length === 0}
          >
            <Text style={[styles.textoAcao, { color: cores.primaria }]}>
              ← Voltar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoAcao,
              {
                backgroundColor: cores.primaria,
                opacity:
                  pinAtual.length < 4 || bloqueado
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={handleConfirmarPin}
            disabled={pinAtual.length < 4 || bloqueado}
            activeOpacity={0.8}
          >
            <Text style={[styles.textoAcao, { color: cores.fundoClaro }]}>
              ✓ Confirmar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoAcao,
              {
                backgroundColor: cores.erro + '20',
                borderColor: cores.erro,
              },
            ]}
            onPress={limparTudo}
            disabled={bloqueado}
          >
            <Text style={[styles.textoAcao, { color: cores.erro }]}>
              ✕ Limpar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link Esqueci PIN */}
        {modo === 'login' && (
          <TouchableOpacity
            style={styles.linkEsqueci}
            onPress={() => {
              Alert.alert(
                'Recuperar Acesso',
                'Entre em contato com o administrador do dispositivo',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      apagarPin(pin).catch(() => {});
                      limparTudo();
                    },
                  },
                ]
              );
            }}
          >
            <Text style={[styles.textoLink, { color: cores.primaria }]}>
              Esqueci o PIN
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '500',
  },
  displayPIN: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  circuloPin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  mensagemStatus: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  textoStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  teclado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  botaoDigito: {
    width: TAMANHO_BOTAO,
    height: TAMANHO_BOTAO,
    borderRadius: TAMANHO_BOTAO / 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoZero: {
    height: TAMANHO_BOTAO,
  },
  textoDigito: {
    fontSize: 24,
    fontWeight: '700',
  },
  botoesAcao: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  botaoAcao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  textoAcao: {
    fontSize: 14,
    fontWeight: '700',
  },
  linkEsqueci: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  textoLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
