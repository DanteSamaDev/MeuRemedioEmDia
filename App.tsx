/**
 * Aplicação Principal com React Navigation
 * Setup de navegação e context providers
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Providers e Contextos
import { TemaProvider, useTema } from './src/context/TemaContext';
import { AutenticacaoProvider, useAutenticacao } from './src/context/AutenticacaoContext';

// Telas
import { TelaHome } from './src/screens/TelaHome';
import { TelaPIN } from './src/screens/TelaPIN';
import { TelaMedicamentos } from './src/screens/TelaMedicamentos';
import { TelaDireitos } from './src/screens/TelaDireitos';
import { TelaUrgencia } from './src/screens/TelaUrgencia';
import { TelaFarmacias } from './src/screens/TelaFarmacias';

// Tipos de Navegação
import { RootStackParamList, AppStackParamList, BottomTabParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Navegador Bottom Tab (abas principais)
 */
const BottomTabNavigator = () => {
  const { cores, tema } = useTema();

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.superficiePrimaria,
          borderTopColor: cores.borda,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <BottomTab.Screen
        name="HomeTab"
        component={TelaHome}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />

      <BottomTab.Screen
        name="MedicamentosTab"
        component={TelaMedicamentos}
        options={{
          title: 'Medicamentos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💊</Text>,
        }}
      />

      <BottomTab.Screen
        name="DireitosTab"
        component={TelaDireitos}
        options={{
          title: 'Direitos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚖️</Text>,
        }}
      />

      <BottomTab.Screen
        name="UrgenciaTab"
        component={TelaUrgencia}
        options={{
          title: 'Urgência',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🚨</Text>,
        }}
      />

      <BottomTab.Screen
        name="FarmaciasTab"
        component={TelaFarmacias}
        options={{
          title: 'Farmácias',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏪</Text>,
        }}
      />
    </BottomTab.Navigator>
  );
};

/**
 * Navegador Principal (Stack)
 */
const RootNavigator = () => {
  const { autenticado, pinConfigurable } = useAutenticacao();
  const { cores } = useTema();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: cores.fundo },
      }}
    >
      {!autenticado && pinConfigurable ? (
        // Tela de Login/PIN
        <Stack.Screen
          name="Autenticacao"
          component={TelaPIN}
          options={{ animationEnabled: false }}
        />
      ) : (
        // App Principal
        <Stack.Screen
          name="App"
          component={BottomTabNavigator}
          options={{ animationEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
};

/**
 * Componente Principal da App
 */
const AppContent = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

/**
 * App com Providers
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TemaProvider>
        <AutenticacaoProvider>
          <AppContent />
        </AutenticacaoProvider>
      </TemaProvider>
    </GestureHandlerRootView>
  );
}

// Import para Text (necessário para emoji icons)
import { Text } from 'react-native';
