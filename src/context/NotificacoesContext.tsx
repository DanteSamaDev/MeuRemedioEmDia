import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { Medicamento, ConfigNotificacao } from '../types';

interface NotificacoesContextType {
  notificacoesHabilitadas: boolean;
  configuracao: ConfigNotificacao;
  agendarNotificacoes: (medicamentos: Medicamento[]) => Promise<void>;
  cancelarNotificacoes: () => Promise<void>;
  atualizarConfiguracao: (config: Partial<ConfigNotificacao>) => Promise<void>;
}

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

const CONFIGURACAO_PADRAO: ConfigNotificacao = {
  habilitada: true,
  minutosAntes: 15,
  som: true,
  vibracao: true,
};

export function NotificacoesProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [configuracao, setConfiguracao] = useState<ConfigNotificacao>(CONFIGURACAO_PADRAO);

  // Inicializar push notifications
  useEffect(() => {
    PushNotification.configure({
      onNotification(notification) {
        console.log('Notificação recebida:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Criar channel padrão
    PushNotification.createChannel(
      {
        channelId: 'meu_remedio_em_dia',
        channelName: 'Meu Remédio em Dia',
        channelDescription: 'Notificações de medicamentos',
        soundName: 'default',
        vibrate: true,
        importance: 4,
      },
      () => {
        console.log('Channel criado');
      }
    );

    // Carregar configuração salva
    carregarConfiguracao();
  }, []);

  const carregarConfiguracao = useCallback(async () => {
    try {
      const salva = await AsyncStorage.getItem(
        '@meu_remedio_em_dia/notificacoes_config'
      );
      if (salva) {
        setConfiguracao(JSON.parse(salva));
      }
    } catch (erro) {
      console.error('Erro ao carregar configuração de notificações:', erro);
    }
  }, []);

  const atualizarConfiguracao = useCallback(
    async (novaConfig: Partial<ConfigNotificacao>) => {
      try {
        const config = { ...configuracao, ...novaConfig };
        setConfiguracao(config);
        await AsyncStorage.setItem(
          '@meu_remedio_em_dia/notificacoes_config',
          JSON.stringify(config)
        );
      } catch (erro) {
        console.error('Erro ao atualizar configuração:', erro);
      }
    },
    [configuracao]
  );

  const agendarNotificacoes = useCallback(
    async (medicamentos: Medicamento[]) => {
      if (!configuracao.habilitada) return;

      try {
        // Cancelar notificações anteriores
        PushNotification.cancelAllLocalNotifications();

        medicamentos.forEach((med) => {
          if (med.ativo && !med.tomado) {
            const [hora, minuto] = med.horario.split(':');
            const agora = new Date();
            const horarioNotificacao = new Date();

            horarioNotificacao.setHours(parseInt(hora, 10));
            horarioNotificacao.setMinutes(parseInt(minuto, 10) - configuracao.minutosAntes);
            horarioNotificacao.setSeconds(0);

            // Se o horário já passou hoje, agendar para amanhã
            if (horarioNotificacao < agora) {
              horarioNotificacao.setDate(horarioNotificacao.getDate() + 1);
            }

            const diferencaMs = horarioNotificacao.getTime() - agora.getTime();

            if (diferencaMs > 0) {
              PushNotification.localNotificationSchedule({
                channelId: 'meu_remedio_em_dia',
                title: 'Medicamento: ' + med.nome,
                message: `Hora de tomar ${med.nome} (${med.dosagem})`,
                date: horarioNotificacao,
                repeatType: 'day',
                soundName: configuracao.som ? 'default' : '',
                vibrate: configuracao.vibracao,
                userInfo: {
                  medicamentoId: med.id,
                },
              });
            }
          }
        });
      } catch (erro) {
        console.error('Erro ao agendar notificações:', erro);
      }
    },
    [configuracao]
  );

  const cancelarNotificacoes = useCallback(async () => {
    try {
      PushNotification.cancelAllLocalNotifications();
    } catch (erro) {
      console.error('Erro ao cancelar notificações:', erro);
    }
  }, []);

  const value: NotificacoesContextType = {
    notificacoesHabilitadas: configuracao.habilitada,
    configuracao,
    agendarNotificacoes,
    cancelarNotificacoes,
    atualizarConfiguracao,
  };

  return (
    <NotificacoesContext.Provider value={value}>
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoes(): NotificacoesContextType {
  const context = useContext(NotificacoesContext);
  if (context === undefined) {
    throw new Error('useNotificacoes deve ser usado dentro de NotificacoesProvider');
  }
  return context;
}

export { NotificacoesContext };
