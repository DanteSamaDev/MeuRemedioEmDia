import React, { useState, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useTema } from '../context/TemaContext';
import { HeaderTela } from '../components';
import { AcaoRapida } from '../types';

const { height } = Dimensions.get('window');

export function TelaUrgencia(): React.JSX.Element {
  const { cores } = useTema();
  const [acoesRapidas] = useState<AcaoRapida[]>([
    {
      id: '1',
      titulo: 'SAMU - Ambulância',
      descricao: 'Chamada para ambulância e primeiros socorros',
      telefone: '192',
      categoria: 'emergencia',
    },
    {
      id: '2',
      titulo: 'Bombeiros',
      descricao: 'Bombeiros para resgate e emergências',
      telefone: '193',
      categoria: 'emergencia',
    },
    {
      id: '3',
      titulo: 'Polícia Militar',
      descricao: 'Segurança e proteção da vida',
      telefone: '190',
      categoria: 'emergencia',
    },
    {
      id: '4',
      titulo: '📞 Disque Saúde SUS',
      descricao: 'Informações sobre saúde e serviços SUS',
      telefone: '136',
      categoria: 'informacao',
    },
    {
      id: '5',
      titulo: 'Central de Urgência',
      descricao: 'Central de Regulação de Urgência Municipal',
      categoria: 'informacao',
      url: 'https://www.saude.gov.br',
    },
    {
      id: '6',
      titulo: 'Anvisa - Medicamentos',
      descricao: 'Denúncias de medicamentos falsificados',
      telefone: '0800-642-9782',
      categoria: 'informacao',
    },
    {
      id: '7',
      titulo: 'Defensoria Pública',
      descricao: 'Assistência jurídica gratuita para saúde',
      categoria: 'politica',
      url: 'https://www.cnj.jus.br',
    },
    {
      id: '8',
      titulo: 'Ministério Público Federal',
      descricao: 'Defesa de direitos constitucionais em saúde',
      categoria: 'politica',
      url: 'https://www.mpf.mp.br',
    },
    {
      id: '9',
      titulo: 'Conselho de Medicamentos',
      descricao: 'Informações sobre medicamentos e bulas',
      categoria: 'informacao',
      url: 'https://anvisa.gov.br',
    },
  ]);

  const handleTelefone = async (telefone: string) => {
    const numero = telefone.replace(/\D/g, '');
    const url = `tel:${numero}`;
    try {
      await Linking.openURL(url);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível fazer a chamada');
    }
  };

  const handleLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível abrir o link');
    }
  };

  const renderCard = ({ item }: { item: AcaoRapida }) => {
    const isEmergencia = item.categoria === 'emergencia';
    
    const bgColor = isEmergencia
      ? cores.erro
      : item.categoria === 'politica'
        ? cores.primaria
        : cores.sucesso;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isEmergencia ? cores.erro + '15' : cores.fundo2,
            borderColor: bgColor,
            borderWidth: 2,
            borderLeftWidth: isEmergencia ? 6 : 2,
            borderLeftColor: bgColor,
          },
        ]}
        onPress={() => {
          if (item.telefone) handleTelefone(item.telefone);
          else if (item.url) handleLink(item.url);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitulo, { color: cores.texto }]}>
              {item.titulo}
            </Text>
            {isEmergencia && (
              <Text style={styles.badgeEmergencia}>🚨</Text>
            )}
          </View>

          <Text style={[styles.cardDescricao, { color: cores.textoSecundario }]}>
            {item.descricao}
          </Text>

          {item.telefone && (
            <View
              style={[
                styles.telefoneBox,
                { backgroundColor: bgColor + '20', borderColor: bgColor },
              ]}
            >
              <Text style={[styles.telefoneTexto, { color: bgColor }]}>
                ☎️ {item.telefone}
              </Text>
            </View>
          )}

          <View style={styles.botaoContainer}>
            {item.telefone && (
              <TouchableOpacity
                style={[styles.botao, { backgroundColor: bgColor }]}
                onPress={() => handleTelefone(item.telefone!)}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoTexto}>Ligar</Text>
              </TouchableOpacity>
            )}

            {item.url && (
              <TouchableOpacity
                style={[
                  styles.botao,
                  {
                    backgroundColor: item.telefone ? cores.primaria : bgColor,
                    marginLeft: item.telefone ? 8 : 0,
                    flex: item.telefone ? 1 : 1,
                  },
                ]}
                onPress={() => handleLink(item.url!)}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoTexto}>Saiba Mais</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: cores.fundo }]}
    >
      <HeaderTela
        titulo="Urgência"
        subtitulo="Contatos e informações de emergência"
      />

      <FlatList
        data={acoesRapidas}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.lista}
        scrollEnabled={height > 600}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lista: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  badgeEmergencia: {
    fontSize: 20,
    marginLeft: 8,
  },
  cardDescricao: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  telefoneBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  telefoneTexto: {
    fontSize: 14,
    fontWeight: '700',
  },
  botaoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  botao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
