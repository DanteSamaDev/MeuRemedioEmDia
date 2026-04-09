import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import { useTema } from '../context/TemaContext';
import { CardMedicamento, HeaderTela } from '../components';
import { useMedicamentos } from '../hooks/useMedicamentos';

const { height } = Dimensions.get('window');

interface FiltroMedicamentos {
  todos: boolean;
  tomados: boolean;
  naoTomados: boolean;
  estoqueBaixo: boolean;
}

export function TelaMedicamentos(): React.JSX.Element {
  const { cores } = useTema();
  const {
    medicamentos,
    loading,
    error,
    marcarComoTomado,
    filtrarMedicamentos,
    calcularResumoDia
  } = useMedicamentos();

  const [filtros, setFiltros] = useState<FiltroMedicamentos>({
    todos: true,
    tomados: false,
    naoTomados: false,
    estoqueBaixo: false,
  });

  // Aplicar filtros aos medicamentos
  const medicamentosFiltrados = filtrarMedicamentos(filtros);

  // Calcular resumo
  const resumo = calcularResumoDia();

  const handleFiltro = (filtro: keyof FiltroMedicamentos) => {
    if (filtro === 'todos') {
      setFiltros({ todos: true, tomados: false, naoTomados: false, estoqueBaixo: false });
    } else {
      setFiltros({
        todos: false,
        tomados: filtro === 'tomados' ? !filtros.tomados : false,
        naoTomados: filtro === 'naoTomados' ? !filtros.naoTomados : false,
        estoqueBaixo: filtro === 'estoqueBaixo' ? !filtros.estoqueBaixo : false,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
        <HeaderTela titulo="Medicamentos" subtitulo="Carregando..." />
        <View style={styles.carregando}>
          <Text style={{ color: cores.texto }}>Carregando medicamentos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
        <HeaderTela titulo="Medicamentos" subtitulo="Erro" />
        <View style={styles.carregando}>
          <Text style={{ color: cores.erro }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            {medicamentos.filter((m) => m.estoque <= m.quantidade * 0.2).length}
          </Text>
          <Text style={[styles.resumoLabel, { color: cores.textoSecundario }]}>
            Estoque Baixo
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[
            styles.filtroBotao,
            {
              backgroundColor: filtros.todos ? cores.primaria : cores.fundo2,
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
            styles.filtroBotao,
            {
              backgroundColor: filtros.tomados ? cores.primaria : cores.fundo2,
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
            Tomados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filtroBotao,
            {
              backgroundColor: filtros.naoTomados ? cores.primaria : cores.fundo2,
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
            styles.filtroBotao,
            {
              backgroundColor: filtros.estoqueBaixo ? cores.primaria : cores.fundo2,
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
            Estoque Baixo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Medicamentos */}
      <FlatList
        data={medicamentosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardMedicamento
            medicamento={item}
            onMarcarTomado={() => marcarComoTomado(item.id)}
          />
        )}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={[styles.vazioTexto, { color: cores.textoSecundario }]}>
              {filtros.todos
                ? 'Nenhum medicamento cadastrado'
                : 'Nenhum medicamento encontrado com este filtro'}
            </Text>
          </View>
        }
      />
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
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resumoCard: {
    flex: 1,
    alignItems: 'center',
  },
  resumoNumero: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resumoLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  divisor: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtroBotao: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  filtroTexto: {
    fontSize: 12,
  },
  listaContainer: {
    padding: 16,
    paddingTop: 0,
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.2,
  },
  vazioTexto: {
    fontSize: 16,
    textAlign: 'center',
  },
});