import React, { useState, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTema } from '../context/TemaContext';
import { CardFarmacia, HeaderTela } from '../components';
import { FarmaciaConveniada } from '../types';

const { height } = Dimensions.get('window');

export function TelaFarmacias(): React.JSX.Element {
  const { cores } = useTema();
  const [farmacias, setFarmacias] = useState<FarmaciaConveniada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroRegiao, setFiltroRegiao] = useState<string>('todas');

  // Dados padrão de farmácias
  const farmaciasIniciais: FarmaciaConveniada[] = [
    {
      id: '1',
      nome: 'Farmácia Popular',
      regiao: 'Centro',
      temEntrega: true,
      temApp: true,
      telefone: '(11) 3000-1000',
      appUrl: 'https://apps.apple.com/br/app',
      horario: '8h - 22h',
      temMedicamentoGenerico: true,
      temMedicamentoManipulado: true,
      temDesconto: true,
      temAtendimentoTelefone: true,
    },
    {
      id: '2',
      nome: 'Drogaria Manipulada',
      regiao: 'Zona Sul',
      temEntrega: true,
      temApp: false,
      telefone: '(11) 3000-2000',
      horario: '9h - 21h',
      temMedicamentoGenerico: false,
      temMedicamentoManipulado: true,
      temDesconto: false,
      temAtendimentoTelefone: true,
    },
    {
      id: '3',
      nome: 'Farmácia SUS 24h',
      regiao: 'Zona Norte',
      temEntrega: false,
      temApp: true,
      telefone: '(11) 3000-3000',
      appUrl: 'https://apps.apple.com/br/app',
      horario: '24h',
      temMedicamentoGenerico: true,
      temMedicamentoManipulado: false,
      temDesconto: true,
      temAtendimentoTelefone: true,
    },
    {
      id: '4',
      nome: 'Drogaria Pro-Gen',
      regiao: 'Zona Leste',
      temEntrega: true,
      temApp: true,
      telefone: '(11) 3000-4000',
      appUrl: 'https://apps.apple.com/br/app',
      horario: '7h - 23h',
      temMedicamentoGenerico: true,
      temMedicamentoManipulado: true,
      temDesconto: true,
      temAtendimentoTelefone: true,
    },
    {
      id: '5',
      nome: 'Farmácia Vida',
      regiao: 'Centro-Oeste',
      temEntrega: false,
      temApp: false,
      telefone: '(11) 3000-5000',
      horario: '8h - 20h',
      temMedicamentoGenerico: true,
      temMedicamentoManipulado: false,
      temDesconto: false,
      temAtendimentoTelefone: true,
    },
  ];

  const carregarFarmacias = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/farmacias'
      );
      if (dados) {
        setFarmacias(JSON.parse(dados));
      } else {
        setFarmacias(farmaciasIniciais);
      }
    } catch (erro) {
      console.error('Erro ao carregar farmácias:', erro);
      setFarmacias(farmaciasIniciais);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFarmacias();
    }, [carregarFarmacias])
  );

  const regioes = [
    'todas',
    ...Array.from(new Set(farmacias.map((f) => f.regiao))),
  ];

  const farmaciasFiltradas = farmacias.filter((farmacia) => {
    if (filtroRegiao === 'todas') return true;
    return farmacia.regiao === filtroRegiao;
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: cores.fundo }]}
    >
      <HeaderTela
        titulo="Farmácias"
        subtitulo="Farmácias conveniadas perto de você"
        botaoDireita={{
          icone: '🔍',
          onPress: () => console.log('Abrir busca'),
        }}
      />

      {carregando ? (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      ) : (
        <>
          {/* Filtro de Regiões */}
          <View
            style={[
              styles.filtroContainer,
              { backgroundColor: cores.superficiePrimaria },
            ]}
          >
            {regioes.map((regiao) => (
              <TouchableOpacity
                key={regiao}
                style={[
                  styles.filtroItem,
                  {
                    backgroundColor:
                      filtroRegiao === regiao ? cores.primaria : cores.fundo2,
                    borderColor:
                      filtroRegiao === regiao ? cores.primaria : cores.divisor,
                  },
                ]}
                onPress={() => setFiltroRegiao(regiao)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filtroTexto,
                    {
                      color: filtroRegiao === regiao ? '#fff' : cores.texto,
                      fontWeight: filtroRegiao === regiao ? '700' : '500',
                    },
                  ]}
                >
                  {regiao === 'todas' ? 'Todas' : regiao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lista de Farmácias */}
          {farmaciasFiltradas.length > 0 ? (
            <FlatList
              data={farmaciasFiltradas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CardFarmacia farmacia={item} />}
              contentContainerStyle={styles.lista}
              scrollEnabled={height > 600}
            />
          ) : (
            <View style={styles.vazio}>
              <Text
                style={[
                  styles.vazioTexto,
                  { color: cores.textoSecundario },
                ]}
              >
                Nenhuma farmácia encontrada nesta região
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtroContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filtroItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroTexto: {
    fontSize: 12,
  },
  lista: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
});
