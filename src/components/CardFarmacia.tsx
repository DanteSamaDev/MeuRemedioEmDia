import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Linking,
  Alert,
} from 'react-native';
import { useTema } from '../context/TemaContext';
import { FarmaciaConveniada } from '../types';

interface CardFarmaciaProps {
  farmacia: FarmaciaConveniada;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CardFarmacia({
  farmacia,
  onPress,
  style,
}: CardFarmaciaProps): React.JSX.Element {
  const { cores } = useTema();

  const handleContato = async () => {
    if (farmacia.telefone) {
      const url = `tel:${farmacia.telefone.replace(/\D/g, '')}`;
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert('Erro', 'Não foi possível fazer a chamada');
      }
    }
  };

  const handleApp = async () => {
    if (farmacia.appUrl) {
      try {
        await Linking.openURL(farmacia.appUrl);
      } catch {
        Alert.alert('Erro', 'Não foi possível abrir o app');
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: cores.fundo2,
          borderColor: cores.primaria,
        },
        style,
      ]}
    >
      {/* Header com Nome e Region */}
      <View
        style={[
          styles.header,
          { borderBottomColor: cores.divisor },
        ]}
      >
        <View style={styles.nomeSection}>
          <Text style={[styles.nome, { color: cores.texto }]}>
            {farmacia.nome}
          </Text>
          <Text
            style={[styles.regiao, { color: cores.textoSecundario }]}
          >
            📍 {farmacia.regiao}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>💊</Text>
        </View>
      </View>

      {/* Detalhes */}
      <View style={styles.body}>
        {/* Tipo de Medicamento */}
        <View style={styles.detalheRow}>
          <Text style={[styles.label, { color: cores.textoSecundario }]}>
            Oferece:
          </Text>
          <View style={styles.tiposContainer}>
            {farmacia.temMedicamentoGenerico && (
              <View
                style={[
                  styles.tipoBadge,
                  { backgroundColor: cores.sucesso + '20', borderColor: cores.sucesso },
                ]}
              >
                <Text style={{ color: cores.sucesso, fontSize: 11, fontWeight: '600' }}>
                  Genéricos
                </Text>
              </View>
            )}
            {farmacia.temMedicamentoManipulado && (
              <View
                style={[
                  styles.tipoBadge,
                  { backgroundColor: cores.aviso + '20', borderColor: cores.aviso },
                ]}
              >
                <Text style={{ color: cores.aviso, fontSize: 11, fontWeight: '600' }}>
                  Manipulados
                </Text>
              </View>
            )}
            {farmacia.temDesconto && (
              <View
                style={[
                  styles.tipoBadge,
                  { backgroundColor: cores.primaria + '20', borderColor: cores.primaria },
                ]}
              >
                <Text
                  style={{ color: cores.primaria, fontSize: 11, fontWeight: '600' }}
                >
                  Desconto
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Disponibilidades */}
        <View style={styles.detalheRow}>
          <Text style={[styles.label, { color: cores.textoSecundario }]}>
            Serviços:
          </Text>
          <View style={styles.servicosContainer}>
            {farmacia.temEntrega && (
              <Text style={[styles.servico, { color: cores.texto }]}>
                🚚 Entrega
              </Text>
            )}
            {farmacia.temApp && (
              <Text style={[styles.servico, { color: cores.texto }]}>
                📱 App
              </Text>
            )}
            {farmacia.temAtendimentoTelefone && (
              <Text style={[styles.servico, { color: cores.texto }]}>
                ☎️ Ligação
              </Text>
            )}
          </View>
        </View>

        {/* Horário */}
        {farmacia.horario && (
          <View style={styles.detalheRow}>
            <Text style={[styles.label, { color: cores.textoSecundario }]}>
              Horário:
            </Text>
            <Text style={[styles.valor, { color: cores.texto }]}>
              {farmacia.horario}
            </Text>
          </View>
        )}
      </View>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        {farmacia.telefone && (
          <TouchableOpacity
            style={[
              styles.botaoAcao,
              {
                backgroundColor: cores.primaria,
                flex: 1,
                marginRight: 8,
              },
            ]}
            onPress={handleContato}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>📞 Ligar</Text>
          </TouchableOpacity>
        )}

        {farmacia.temApp && farmacia.appUrl && (
          <TouchableOpacity
            style={[
              styles.botaoAcao,
              {
                backgroundColor: cores.sucesso,
                flex: 1,
                marginLeft: farmacia.telefone ? 0 : 0,
              },
            ]}
            onPress={handleApp}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>📲 App</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
  },
  nomeSection: {
    flex: 1,
  },
  nome: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  regiao: {
    fontSize: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  badgeTexto: {
    fontSize: 16,
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  detalheRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  tiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tipoBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  servicosContainer: {
    gap: 4,
  },
  servico: {
    fontSize: 12,
    fontWeight: '500',
  },
  valor: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  botaoAcao: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
