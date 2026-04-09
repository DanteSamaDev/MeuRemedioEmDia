import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useTema } from '../context/TemaContext';

interface HeaderTelaProps {
  titulo: string;
  subtitulo?: string;
  onVolta?: () => void;
  mostrarBotaoVoltar?: boolean;
  botaoDireita?: {
    icone: string;
    onPress: () => void;
  };
  estilo?: ViewStyle;
}

export function HeaderTela({
  titulo,
  subtitulo,
  onVolta,
  mostrarBotaoVoltar = false,
  botaoDireita,
  estilo,
}: HeaderTelaProps): React.JSX.Element {
  const { cores, tema } = useTema();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.superficiePrimaria,
        },
        estilo,
      ]}
    >
      <StatusBar
        barStyle={tema === 'claro' ? 'dark-content' : 'light-content'}
        backgroundColor={cores.superficiePrimaria}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.conteudo}>
          {/* Botão Voltar */}
          {mostrarBotaoVoltar && (
            <TouchableOpacity
              onPress={onVolta}
              style={styles.botaoVoltar}
              activeOpacity={0.7}
            >
              <Text style={[styles.iconoVoltar, { color: cores.primaria }]}>
                ← Voltar
              </Text>
            </TouchableOpacity>
          )}

          {/* Textos */}
          <View style={styles.textos}>
            <Text
              style={[
                styles.titulo,
                { color: cores.texto },
              ]}
            >
              {titulo}
            </Text>
            {subtitulo && (
              <Text
                style={[
                  styles.subtitulo,
                  { color: cores.textoSecundario },
                ]}
              >
                {subtitulo}
              </Text>
            )}
          </View>

          {/* Botão Direita */}
          {botaoDireita && (
            <TouchableOpacity
              onPress={botaoDireita.onPress}
              style={styles.botaoDireita}
              activeOpacity={0.7}
            >
              <Text style={styles.iconoDireita}>
                {botaoDireita.icone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  safeArea: {
    paddingHorizontal: 16,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 48,
  },
  botaoVoltar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: 12,
  },
  iconoVoltar: {
    fontSize: 14,
    fontWeight: '700',
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 13,
  },
  botaoDireita: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  iconoDireita: {
    fontSize: 20,
  },
});
