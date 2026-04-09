import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTema } from '../context/TemaContext';
import { Medicamento, Periodo } from '../types';

interface CardMedicamentoProps {
  medicamento: Medicamento;
  onPress?: () => void;
  onMarcarTomado?: (id: string, tomado: boolean) => void;
  style?: ViewStyle;
}

const CORES_PERIODO = {
  manha: '🌅',
  tarde: '☀️',
  noite: '🌙',
};

export function CardMedicamento({
  medicamento,
  onPress,
  onMarcarTomado,
  style,
}: CardMedicamentoProps): React.JSX.Element {
  const { cores } = useTema();

  const percentualEstoque = Math.round(
    (medicamento.estoque / medicamento.quantidade) * 100
  );

  const handleToggle = () => {
    onMarcarTomado?.(medicamento.id, !medicamento.tomado);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: cores.fundo2,
          borderColor: medicamento.tomado ? cores.sucesso : cores.primaria,
          borderWidth: medicamento.tomado ? 2 : 1,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nomeSection}>
          <Text
            style={[styles.nome, { color: cores.texto }]}
            numberOfLines={2}
          >
            {medicamento.nome}
          </Text>
          <Text style={[styles.dosagem, { color: cores.textoSecundario }]}>
            {medicamento.dosagem}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleToggle}
          style={[
            styles.botaoTomado,
            {
              backgroundColor: medicamento.tomado
                ? cores.sucesso
                : cores.fundo,
              borderColor: medicamento.tomado ? cores.sucesso : cores.primaria,
            },
          ]}
        >
          <Text style={styles.iconTomado}>
            {medicamento.tomado ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: cores.textoSecundario }]}>
            Período:
          </Text>
          <Text style={[styles.valor, { color: cores.texto }]}>
            {CORES_PERIODO[medicamento.periodo]} {medicamento.periodo}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: cores.textoSecundario }]}>
            Horário:
          </Text>
          <Text style={[styles.valor, { color: cores.texto }]}>
            {medicamento.horario}
          </Text>
        </View>

        {/* Estoque Bar */}
        <View style={styles.estoqueSection}>
          <View style={styles.estoqueHeader}>
            <Text style={[styles.label, { color: cores.textoSecundario }]}>
              Estoque:
            </Text>
            <Text
              style={[
                styles.percentual,
                {
                  color:
                    percentualEstoque > 30
                      ? cores.sucesso
                      : percentualEstoque > 10
                        ? cores.aviso
                        : cores.erro,
                },
              ]}
            >
              {percentualEstoque}%
            </Text>
          </View>
          <View
            style={[
              styles.estoqueBar,
              { backgroundColor: cores.fundo, borderColor: cores.divisor },
            ]}
          >
            <View
              style={[
                styles.estoqueFill,
                {
                  width: `${percentualEstoque}%`,
                  backgroundColor:
                    percentualEstoque > 30
                      ? cores.sucesso
                      : percentualEstoque > 10
                        ? cores.aviso
                        : cores.erro,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      {medicamento.tomado && (
        <View
          style={[
            styles.footer,
            { backgroundColor: cores.sucesso + '20', borderTopColor: cores.sucesso },
          ]}
        >
          <Text style={[styles.textoFooter, { color: cores.sucesso }]}>
            ✓ Medicamento tomado
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nomeSection: {
    flex: 1,
    marginRight: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dosagem: {
    fontSize: 13,
  },
  botaoTomado: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  iconTomado: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  body: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  valor: {
    fontSize: 13,
    fontWeight: '500',
  },
  estoqueSection: {
    marginTop: 8,
  },
  estoqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  percentual: {
    fontSize: 13,
    fontWeight: '700',
  },
  estoqueBar: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  estoqueFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  textoFooter: {
    fontSize: 12,
    fontWeight: '600',
  },
});
