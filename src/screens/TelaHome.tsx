/**
 * Tela Home
 * Exibe resumo do dia, próximos medicamentos e alertas
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../context/TemaContext';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_MEDICAMENTOS = '@meu_remedio_em_dia/medicamentos/v2';

interface Medicamento {
  id: string;
  nome: string;
  horario: string;
  periodo: 'manha' | 'tarde' | 'noite';
  tomado: boolean;
}

export const TelaHome: React.FC = () => {
  const { cores } = useTema();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [proximoMedicamento, setProximoMedicamento] = useState<Medicamento | null>(null);
  const [resumoDia, setResumoDia] = useState({ tomados: 0, total: 0 });

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_MEDICAMENTOS);
      if (dados) {
        const medicamentosCarregados = JSON.parse(dados);
        setMedicamentos(medicamentosCarregados);

        // Calcular resumo
        const tomados = medicamentosCarregados.filter((m: Medicamento) => m.tomado).length;
        setResumoDia({
          tomados,
          total: medicamentosCarregados.length,
        });

        // Encontrar próximo medicamento
        const agora = new Date();
        const proximosAtivos = medicamentosCarregados
          .filter((m: Medicamento) => !m.tomado)
          .sort((a: Medicamento, b: Medicamento) => a.horario.localeCompare(b.horario));

        if (proximosAtivos.length > 0) {
          setProximoMedicamento(proximosAtivos[0]);
        }
      }
    } catch (erro) {
      console.error('Erro ao carregar medicamentos:', erro);
    }
  };

  const styles = criarEstilos(cores);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
      <StatusBar barStyle={cores.fundo === '#F3F6FB' ? 'dark-content' : 'light-content'} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>💊 Bem-vindo de volta!</Text>
          <Text style={styles.data}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        {/* Card Resumo Diário */}
        <View style={[styles.card, { backgroundColor: cores.superficiePrimaria }]}>
          <Text style={[styles.tituloCard, { color: cores.texto }]}>📊 Resumo do Dia</Text>

          <View style={styles.resumoGrid}>
            <View style={styles.resumoItem}>
              <Text style={[styles.resumoNumero, { color: cores.primaria }]}>
                {resumoDia.tomados}
              </Text>
              <Text style={[styles.resumoTexto, { color: cores.textoSecundario }]}>
                Tomados
              </Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.resumoItem}>
              <Text style={[styles.resumoNumero, { color: cores.texto }]}>
                {resumoDia.total}
              </Text>
              <Text style={[styles.resumoTexto, { color: cores.textoSecundario }]}>
                Total
              </Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.resumoItem}>
              <Text style={[styles.resumoNumero, { color: cores.sucesso }]}>
                {resumoDia.total > 0 ? Math.round((resumoDia.tomados / resumoDia.total) * 100) : 0}%
              </Text>
              <Text style={[styles.resumoTexto, { color: cores.textoSecundario }]}>
                Adesão
              </Text>
            </View>
          </View>

          {/* Barra de progresso */}
          <View
            style={[
              styles.barraProgresso,
              { backgroundColor: cores.borda },
            ]}
          >
            <View
              style={[
                styles.barraProgressoFill,
                {
                  width: `${resumoDia.total > 0 ? (resumoDia.tomados / resumoDia.total) * 100 : 0}%`,
                  backgroundColor: cores.sucesso,
                },
              ]}
            />
          </View>
        </View>

        {/* Próximo Medicamento */}
        {proximoMedicamento && (
          <View style={[styles.card, { backgroundColor: cores.primaria }]}>
            <Text style={[styles.tituloCard, { color: '#FFFFFF' }]}>⏰ Próximo Medicamento</Text>

            <View style={styles.proximoMedContent}>
              <Text style={styles.proximoMedNome}>{proximoMedicamento.nome}</Text>
              <Text style={styles.proximoMedHorario}>
                {proximoMedicamento.horario} · {obterNomePeriodo(proximoMedicamento.periodo)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.botaoProximo, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            >
              <Text style={styles.botaoProximoTexto}>Marcar como tomado →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Atalhos Rápidos */}
        <View style={[styles.card, { backgroundColor: cores.superficiePrimaria }]}>
          <Text style={[styles.tituloCard, { color: cores.texto }]}>🚀 Atalhos Rápidos</Text>

          <View style={styles.atalhoGrid}>
            <TouchableOpacity
              style={[styles.atalho, { backgroundColor: cores.neutra }]}
            >
              <Text style={styles.atalhoTexto}>📋\nMedicamentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.atalho, { backgroundColor: cores.neutra }]}
            >
              <Text style={styles.atalhoTexto}>⚖️\nDireitos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.atalho, { backgroundColor: cores.neutra }]}
            >
              <Text style={styles.atalhoTexto}>🚨\nUrgência</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.atalho, { backgroundColor: cores.neutra }]}
            >
              <Text style={styles.atalhoTexto}>🏪\nFarmácias</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dica do Dia */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: cores.sucesso,
              borderLeftWidth: 4,
              borderLeftColor: cores.sucesso,
            },
          ]}
        >
          <Text style={[styles.tituloCard, { color: '#FFFFFF' }]}>💡 Dica do Dia</Text>
          <Text style={styles.dicaTexto}>
            Tomar medicamentos no mesmo horário todo dia ajuda o corpo a se acostumar e melhora a adesão ao tratamento!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function obterNomePeriodo(periodo: string): string {
  const nomes: { [key: string]: string } = {
    manha: '☀️ Manhã',
    tarde: '☕ Tarde',
    noite: '🌙 Noite',
  };
  return nomes[periodo] || periodo;
}

function criarEstilos(cores: Record<string, string>) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scroll: {
      padding: 16,
    },
    cabecalho: {
      marginBottom: 24,
    },
    titulo: {
      fontSize: 32,
      fontWeight: '700',
      color: cores.texto,
      marginBottom: 4,
    },
    data: {
      fontSize: 16,
      color: cores.textoSecundario,
    },
    card: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    tituloCard: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },
    resumoGrid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    resumoItem: {
      flex: 1,
      alignItems: 'center',
    },
    resumoNumero: {
      fontSize: 32,
      fontWeight: '700',
    },
    resumoTexto: {
      fontSize: 14,
      marginTop: 4,
    },
    divisor: {
      width: 1,
      height: 40,
      backgroundColor: '#E0E0E0',
    },
    barraProgresso: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    barraProgressoFill: {
      height: '100%',
      borderRadius: 4,
    },
    proximoMedContent: {
      marginBottom: 12,
    },
    proximoMedNome: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    proximoMedHorario: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
    },
    botaoProximo: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    botaoProximoTexto: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    atalhoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    atalho: {
      width: '48%',
      paddingVertical: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    atalhoTexto: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 36,
    },
    dicaTexto: {
      fontSize: 16,
      color: '#FFFFFF',
      lineHeight: 24,
    },
  });
}

export default TelaHome;
