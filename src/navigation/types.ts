/**
 * Tipos de Navegação
 * Define os parâmetros das telas e stacks
 */

import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Parâmetros do Stack Navegador Principal
 */
export type RootStackParamList = {
  Autenticacao: undefined;
  App: undefined;
  TelaLogin: undefined;
  TelaPIN: undefined;
};

/**
 * Parâmetros do Stack da Aplicação
 */
export type AppStackParamList = {
  Home: undefined;
  Medicamentos: undefined;
  Direitos: undefined;
  Urgencia: undefined;
  Farmacias: undefined;
  DetalheMedicamento: { medicamentoId: string };
  DetalheDireito: { diretoId: string };
  Configuracoes: undefined;
};

/**
 * Parâmetros do Bottom Tab Navigator
 */
export type BottomTabParamList = {
  HomeTab: undefined;
  MedicamentosTab: undefined;
  DireitosTab: undefined;
  UrgenciaTab: undefined;
  FarmaciasTab: undefined;
};
