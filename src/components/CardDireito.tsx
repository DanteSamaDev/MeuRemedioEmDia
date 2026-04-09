import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useTema } from '../context/TemaContext';
import { Direito } from '../types';

// Habilitar LayoutAnimation no Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CardDireitoProps {
  direito: Direito;
  onPress?: () => void;
  expandido?: boolean;
  style?: ViewStyle;
}

const CORES_CATEGORIA = {
  sus: { emoji: '🏥', cor: 'bg-blue' },
  judicial: { emoji: '⚖️', cor: 'bg-purple' },
  isencao: { emoji: '💊', cor: 'bg-green' },
};

export function CardDireito({
  direito,
  onPress,
  expandido: expandidoProps,
  style,
}: CardDireitoProps): React.JSX.Element {
  const { cores } = useTema();
  const [expandido, setExpandido] = useState(expandidoProps ?? false);

  const handlePress = () => {
    LayoutAnimation.easeInEaseOut();
    setExpandido(!expandido);
    onPress?.();
  };

  const iconEmoji = CORES_CATEGORIA[direito.categoria]?.emoji || '📋';

  return (
    <TouchableOpacity
      onPress={handlePress}
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
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: cores.divisor },
        ]}
      >
        <View style={styles.iconoContainer}>
          <Text style={styles.icono}>{iconEmoji}</Text>
        </View>

        <View style={styles.conteudoHeader}>
          <Text
            style={[styles.titulo, { color: cores.texto }]}
            numberOfLines={2}
          >
            {direito.titulo}
          </Text>
          <Text
            style={[styles.categoria, { color: cores.textoSecundario }]}
            numberOfLines={1}
          >
            {direito.categoria === 'sus'
              ? 'SUS'
              : direito.categoria === 'judicial'
                ? 'Direito Judicial'
                : 'Isenção'}
          </Text>
        </View>

        <View style={styles.seta}>
          <Text
            style={[
              styles.setaTexto,
              {
                color: cores.primaria,
                transform: [{ rotate: expandido ? '180deg' : '0deg' }],
              },
            ]}
          >
            ▼
          </Text>
        </View>
      </View>

      {/* Descrição e Passos (Expandido) */}
      {expandido && (
        <View style={[styles.conteudo, { borderTopColor: cores.divisor }]}>
          <Text
            style={[styles.descricao, { color: cores.texto }]}
          >
            {direito.descricao}
          </Text>

          {/* Passos */}
          {direito.passos && direito.passos.length > 0 && (
            <View style={styles.passosContainer}>
              <Text
                style={[styles.passosTitle, { color: cores.texto }]}
              >
                Como conseguir:
              </Text>
              {direito.passos.map((passo, idx) => (
                <View key={idx} style={styles.passoRow}>
                  <View
                    style={[
                      styles.numeroBolinha,
                      { backgroundColor: cores.primaria },
                    ]}
                  >
                    <Text style={styles.numero}>{idx + 1}</Text>
                  </View>
                  <Text
                    style={[styles.passoTexto, { color: cores.texto }]}
                    numberOfLines={3}
                  >
                    {passo}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Botão de Ação */}
          <TouchableOpacity
            style={[
              styles.botaoAcao,
              { backgroundColor: cores.primaria },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>📲 Saiba Mais</Text>
          </TouchableOpacity>
        </View>
      )}
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
    padding: 12,
    borderBottomWidth: 1,
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  icono: {
    fontSize: 20,
  },
  conteudoHeader: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoria: {
    fontSize: 12,
    fontWeight: '500',
  },
  seta: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  setaTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  conteudo: {
    padding: 12,
    borderTopWidth: 1,
  },
  descricao: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  passosContainer: {
    marginBottom: 12,
  },
  passosTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  passoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  numeroBolinha: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    flexShrink: 0,
  },
  numero: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  passoTexto: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  botaoAcao: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
