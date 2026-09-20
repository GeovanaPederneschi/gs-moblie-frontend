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
import { LeituraSensor } from "../types/leitura";
import LeituraCard from "../components/LeituraCard";
import * as leituraService from "../services/leituraService";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ListaLeituras">;
};

export default function ListaLeiturasScreen({ navigation }: Props) {
  const [leituras, setLeituras] = useState<LeituraSensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { height } = useWindowDimensions();

  useEffect(() => {
    carregarLeituras();
  }, []);

  async function carregarLeituras() {
    setLoading(true);
    setErro("");
    try {
      const dados = await leituraService.listar();
      setLeituras(dados);
    } catch {
      setErro("Erro ao carregar leituras. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.subtitulo}>Histórico de leituras operacionais</Text>

      {loading && <ActivityIndicator size="large" color="#7C4DFF" style={styles.loading} />}
      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!loading && leituras.length === 0 && erro === "" && (
            <Text style={styles.vazio}>Nenhuma leitura registrada.</Text>
          )}
          {leituras.map((leitura) => (
            <LeituraCard
              key={leitura.id.toString()}
              leitura={leitura}
              onPress={() => {}}
            />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.btnPrimario}
        onPress={() => navigation.navigate("ListaSensores")}
      >
        <Text style={styles.btnPrimarioText}>Selecionar Sensor para Nova Leitura</Text>
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
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  btnPrimarioText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
