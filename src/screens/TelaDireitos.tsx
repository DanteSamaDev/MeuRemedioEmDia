import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTema } from '../context/TemaContext';
import { CardDireito, HeaderTela } from '../components';
import { Direito } from '../types';

const { height } = Dimensions.get('window');

export function TelaDireitos(): React.JSX.Element {
  const { cores } = useTema();
  const [direitos, setDireitos] = useState<Direito[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<'sus' | 'judicial' | 'isencao' | 'todas'>('todas');

  // Dados padrão de direitos (pode vir de backend depois)
  const direitosIniciais: Direito[] = [
    {
      id: '1',
      titulo: 'Acesso Universal ao SUS',
      descricao:
        'Todo brasileiro tem direito de acessar medicamentos e tratamentos através do SUS gratuitamente.',
      passos: [
        'Procure uma unidade básica de saúde (Posto ou Centro de Saúde)',
        'Agende uma consulta com seu médico',
        'Apresente seus documentos pessoais (CPF, RG, Cartão do SUS)',
        'Se prescrito, retire o medicamento na farmácia da unidade',
      ],
      categoria: 'sus',
    },
    {
      id: '2',
      titulo: 'Medicamentos Genéricos com Desconto',
      descricao:
        'Você tem direito a receber medicamentos genéricos com preço reduzido nas farmácias participantes do programa.',
      passos: [
        'Procure farmácias que ofereçam o programa',
        'Solicite a versão genérica do medicamento prescrito',
        'Apresente o receituário médico',
        'Aproveite os descontos oferecidos',
      ],
      categoria: 'sus',
    },
    {
      id: '3',
      titulo: 'Direito a Medicamentos de Alto Custo',
      descricao:
        'Pacientes com doenças crônicas podem ter acesso a medicamentos de alto custo pelo SUS através de processos específicos.',
      passos: [
        'Obtenha diagnóstico médico confirmado',
        'Solicit ao seu médico uma requisição oficial',
        'Procure a secretaria de saúde do seu município',
        'Apresente toda documentação médica necessária',
      ],
      categoria: 'judicial',
    },
    {
      id: '4',
      titulo: 'Isenção de Impostos em Medicamentos',
      descricao:
        'Pessoas com deficiência, diabéticos e portadores de epil êpsia podem ter isenção de impostos na compra de medicamentos.',
      passos: [
        'Verifique se você se enquadra em alguma das categorias',
        'Apresente o laudo comprobatório na farmácia',
        'Solicite a isenção de ICMS e PIS/COFINS',
        'O medicamento terá preço reduzido automaticamente',
      ],
      categoria: 'isencao',
    },
  ];

  const carregarDireitos = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/direitos'
      );
      if (dados) {
        setDireitos(JSON.parse(dados));
      } else {
        // Usar dados iniciais se não houver no storage
        setDireitos(direitosIniciais);
      }
    } catch (erro) {
      console.error('Erro ao carregar direitos:', erro);
      setDireitos(direitosIniciais);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDireitos();
    }, [carregarDireitos])
  );

  const diretosFiltrados = direitos.filter((direito) => {
    if (categoriaSelecionada === 'todas') return true;
    return direito.categoria === categoriaSelecionada;
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: cores.fundo }]}
    >
      <HeaderTela
        titulo="Direitos de Saúde"
        subtitulo="Conheça seus direitos e como usá-los"
      />

      {carregando ? (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      ) : (
        <>
          {/* Abas de Categoria */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.abasContainer}
          >
            {(['todas', 'sus', 'judicial', 'isencao'] as const).map((cat) => {
              const labels = {
                todas: 'Todos',
                sus: '🏥 SUS',
                judicial: '⚖️ Judicial',
                isencao: '💊 Isenção',
              };
              
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.abaItem,
                    {
                      backgroundColor:
                        categoriaSelecionada === cat ? cores.primaria : cores.fundo2,
                      borderColor: cores.primaria,
                    },
                  ]}
                  onPress={() => setCategoriaSelecionada(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.abaTexto,
                      {
                        color:
                          categoriaSelecionada === cat ? '#fff' : cores.texto,
                      },
                    ]}
                  >
                    {labels[cat]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Lista de Direitos */}
          <FlatList
            data={diretosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardDireito direito={item} />
            )}
            contentContainerStyle={styles.lista}
            scrollEnabled={height > 600}
          />
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
  abasContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  abaWrapper: {
    marginHorizontal: 8,
  },
  abaItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  lista: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
