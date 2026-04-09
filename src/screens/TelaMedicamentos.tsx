import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTema } from '../context/TemaContext';
import { CardMedicamento, HeaderTela } from '../components';
import { Medicamento } from '../types';

const { height } = Dimensions.get('window');

interface FiltroMedicamentos {
  todos: boolean;
  tomados: boolean;
  naoTomados: boolean;
  estoqueBaixo: boolean;
}

export function TelaMedicamentos(): React.JSX.Element {
  const { cores } = useTema();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState<FiltroMedicamentos>({
    todos: true,
    tomados: false,
    naoTomados: false,
    estoqueBaixo: false,
  });

  // Carregar medicamentos
  const carregarMedicamentos = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/medicamentos'
      );
      if (dados) {
        setMedicamentos(JSON.parse(dados));
      }
    } catch (erro) {
      console.error('Erro ao carregar medicamentos:', erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarMedicamentos();
    }, [carregarMedicamentos])
  );

  // Marcar medicamento como tomado
  const handleMarcarTomado = useCallback(async (id: string, tomado: boolean) => {
    try {
      const novosmed = medicamentos.map((med) =>
        med.id === id ? { ...med, tomado } : med
      );
      setMedicamentos(novosmed);
      await AsyncStorage.setItem(
        '@meu_remedio_em_dia/medicamentos',
        JSON.stringify(novosmed)
      );
    } catch (erro) {
      console.error('Erro ao marcar medicamento:', erro);
    }
  }, [medicamentos]);

  // Filtrar medicamentos
  const medicamentosFiltrados = medicamentos.filter((med) => {
    if (filtros.todos) return true;
    if (filtros.tomados && med.tomado) return true;
    if (filtros.naoTomados && !med.tomado) return true;
    if (filtros.estoqueBaixo && med.estoque <= med.quantidade * 0.2) return true;
    return false;
  });

  // Calcular resumo
  const resumo = {
    total: medicamentos.length,
    tomados: medicamentos.filter((m) => m.tomado).length,
    estoqueBaixo: medicamentos.filter((m) => m.estoque <= m.quantidade * 0.2)
      .length,
  };

  const handleFiltro = (filtro: keyof FiltroMedicamentos) => {
    if (filtro === 'todos') {
      setFiltros({ todos: true, tomados: false, naoTomados: false, estoqueBaixo: false });
    } else {
      setFiltros({
        todos: false,
        [filtro]: !filtros[filtro],
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: cores.fundo }]}
    >
      <HeaderTela
        titulo="Medicamentos"
        subtitulo={`${resumo.tomados}/${resumo.total} tomados hoje`}
        botaoDireita={{
          icone: '➕',
          onPress: () => console.log('Adicionar medicamento'),
        }}
      />

      {carregando ? (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      ) : (
        <>
          {/* Resumo Cards */}
          <View
            style={[
              styles.resumoContainer,
              { backgroundColor: cores.superficiePrimaria },
            ]}
          >
            <View style={styles.resumoCard}>
              <Text style={[styles.resumoNumero, { color: cores.primaria }]}>
                {resumo.tomados}
              </Text>
              <Text style={[styles.resumoLabel, { color: cores.textoSecundario }]}>
                Tomados
              </Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.resumoCard}>
              <Text
                style={[
                  styles.resumoNumero,
                  { color: cores.aviso },
                ]}
              >
                {resumo.estoqueBaixo}
              </Text>
              <Text style={[styles.resumoLabel, { color: cores.textoSecundario }]}>
                Estoque Baixo
              </Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.resumoCard}>
              <Text style={[styles.resumoNumero, { color: cores.sucesso }]}>
                {resumo.total}
              </Text>
              <Text style={[styles.resumoLabel, { color: cores.textoSecundario }]}>
                Total
              </Text>
            </View>
          </View>

          {/* Filtros */}
          <View style={styles.filtrosContainer}>
            <TouchableOpacity
              style={[
                styles.filtro,
                {
                  backgroundColor: filtros.todos ? cores.primaria : cores.fundo2,
                  borderColor: cores.primaria,
                },
              ]}
              onPress={() => handleFiltro('todos')}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  {
                    color: filtros.todos ? '#fff' : cores.texto,
                    fontWeight: filtros.todos ? '700' : '500',
                  },
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filtro,
                {
                  backgroundColor: filtros.tomados ? cores.sucesso : cores.fundo2,
                  borderColor: cores.sucesso,
                },
              ]}
              onPress={() => handleFiltro('tomados')}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  {
                    color: filtros.tomados ? '#fff' : cores.texto,
                    fontWeight: filtros.tomados ? '700' : '500',
                  },
                ]}
              >
                Tomados ✓
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filtro,
                {
                  backgroundColor: filtros.naoTomados ? cores.erro : cores.fundo2,
                  borderColor: cores.erro,
                },
              ]}
              onPress={() => handleFiltro('naoTomados')}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  {
                    color: filtros.naoTomados ? '#fff' : cores.texto,
                    fontWeight: filtros.naoTomados ? '700' : '500',
                  },
                ]}
              >
                Pendentes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filtro,
                {
                  backgroundColor: filtros.estoqueBaixo
                    ? cores.aviso
                    : cores.fundo2,
                  borderColor: cores.aviso,
                },
              ]}
              onPress={() => handleFiltro('estoqueBaixo')}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  {
                    color: filtros.estoqueBaixo ? '#fff' : cores.texto,
                    fontWeight: filtros.estoqueBaixo ? '700' : '500',
                  },
                ]}
              >
                Estoque ⚠️
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Medicamentos */}
          {medicamentosFiltrados.length > 0 ? (
            <FlatList
              data={medicamentosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardMedicamento
                  medicamento={item}
                  onMarcarTomado={handleMarcarTomado}
                />
              )}
              contentContainerStyle={styles.lista}
              scrollEnabled={height > 600}
            />
          ) : (
            <View style={styles.vazio}>
              <Text style={[styles.vazioTexto, { color: cores.textoSecundario }]}>
                {medicamentos.length === 0
                  ? 'Nenhum medicamento cadastrado'
                  : 'Nenhum medicamento encontrado com este filtro'}
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
  resumoContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 0,
  },
  resumoCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divisor: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  resumoNumero: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  resumoLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  filtro: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filtroTexto: {
    fontSize: 12,
  },
  lista: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
