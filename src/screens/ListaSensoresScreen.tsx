import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { SensorModulo } from "../types/sensor";
import SensorCard from "../components/SensorCard";
import * as sensorService from "../services/sensorService";
import * as alertaService from "../services/alertaService";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ListaSensores">;
};

export default function ListaSensoresScreen({ navigation }: Props) {
  const [sensores, setSensores] = useState<SensorModulo[]>([]);
  const [alertasAtivos, setAlertasAtivos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { height } = useWindowDimensions();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    setErro("");
    try {
      const [listaSensores, listaAlertas] = await Promise.all([
        sensorService.listar(),
        alertaService.listar(),
      ]);
      setSensores(listaSensores);
      setAlertasAtivos(listaAlertas.filter((a) => !a.resolvido).length);
    } catch {
      setErro("Erro ao carregar dados. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.btnSecundario}
          onPress={() => navigation.navigate("ListaAlertas")}
        >
          <Text style={styles.btnSecundarioText}>
            Ver Alertas{alertasAtivos > 0 ? ` (${alertasAtivos})` : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSecundario}
          onPress={() => navigation.navigate("ListaLeituras")}
        >
          <Text style={styles.btnSecundarioText}>Ver Leituras</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Toque em um sensor para registrar uma leitura</Text>

      {loading && <ActivityIndicator size="large" color="#00BFFF" style={styles.loading} />}
      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!loading && sensores.length === 0 && erro === "" && (
            <Text style={styles.vazio}>Nenhum sensor cadastrado.</Text>
          )}
          {sensores.map((sensor) => (
            <SensorCard
              key={sensor.id.toString()}
              sensor={sensor}
              onPress={() =>
                navigation.navigate("CadastroLeitura", {
                  sensorId: sensor.id,
                  sensorNome: sensor.nome,
                })
              }
            />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.btnPrimario}
        onPress={() => navigation.navigate("CadastroSensor")}
      >
        <Text style={styles.btnPrimarioText}>+ Novo Sensor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  subtitulo: {
    color: "#78909C",
    fontSize: 13,
    marginBottom: 14,
  },
  loading: {
    marginVertical: 20,
  },
  erro: {
    color: "#F44336",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 13,
  },
  vazio: {
    color: "#546E7A",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  btnPrimario: {
    backgroundColor: "#00BFFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  btnPrimarioText: {
    color: "#0D1B2A",
    fontWeight: "bold",
    fontSize: 15,
  },
  btnSecundario: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00BFFF",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  btnSecundarioText: {
    color: "#00BFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
