import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ListaSensoresScreen from "./src/screens/ListaSensoresScreen";
import CadastroSensorScreen from "./src/screens/CadastroSensorScreen";
import ListaLeiturasScreen from "./src/screens/ListaLeiturasScreen";
import CadastroLeituraScreen from "./src/screens/CadastroLeituraScreen";
import ListaAlertasScreen from "./src/screens/ListaAlertasScreen";
import DetalheAlertaScreen from "./src/screens/DetalheAlertaScreen";

export type RootStackParamList = {
  ListaSensores: undefined;
  CadastroSensor: undefined;
  ListaLeituras: undefined;
  CadastroLeitura: { sensorId: number; sensorNome: string };
  ListaAlertas: undefined;
  DetalheAlerta: { alertaId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListaSensores"
        screenOptions={{
          headerStyle: { backgroundColor: "#0D1B2A" },
          headerTintColor: "#00BFFF",
          headerTitleStyle: { fontWeight: "bold", color: "#E0F0FF" },
          cardStyle: { backgroundColor: "#0D1B2A" },
        }}
      >
        <Stack.Screen
          name="ListaSensores"
          component={ListaSensoresScreen}
          options={{ title: "Sensores da Missão" }}
        />
        <Stack.Screen
          name="CadastroSensor"
          component={CadastroSensorScreen}
          options={{ title: "Novo Sensor" }}
        />
        <Stack.Screen
          name="ListaLeituras"
          component={ListaLeiturasScreen}
          options={{ title: "Leituras Operacionais" }}
        />
        <Stack.Screen
          name="CadastroLeitura"
          component={CadastroLeituraScreen}
          options={{ title: "Registrar Leitura" }}
        />
        <Stack.Screen
          name="ListaAlertas"
          component={ListaAlertasScreen}
          options={{ title: "Alertas Críticos" }}
        />
        <Stack.Screen
          name="DetalheAlerta"
          component={DetalheAlertaScreen}
          options={{ title: "Detalhe do Alerta" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
