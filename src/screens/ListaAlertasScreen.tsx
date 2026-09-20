import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { AlertaCritico } from "../types/alerta";
import AlertaCard from "../components/AlertaCard";
import * as alertaService from "../services/alertaService";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ListaAlertas">;
};

export default function ListaAlertasScreen({ navigation }: Props) {
  const [alertas, setAlertas] = useState<AlertaCritico[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { height } = useWindowDimensions();

  useEffect(() => {
    carregarAlertas();
  }, []);

  async function carregarAlertas() {
    setLoading(true);
    setErro("");
    try {
      const dados = await alertaService.listar();
      const ordenados = [...dados].sort((a, b) => {
        if (a.resolvido === b.resolvido) return 0;
        return a.resolvido ? 1 : -1;
      });
      setAlertas(ordenados);
    } catch {
      setErro("Erro ao carregar alertas. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  }

  const ativos = alertas.filter((a) => !a.resolvido).length;

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>
          {ativos} alerta{ativos !== 1 ? "s" : ""} ativo{ativos !== 1 ? "s" : ""}
        </Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#F44336" style={styles.loading} />}
      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!loading && alertas.length === 0 && erro === "" && (
            <Text style={styles.vazio}>Nenhum alerta registrado.</Text>
          )}
          {alertas.map((alerta) => (
            <AlertaCard
              key={alerta.id.toString()}
              alerta={alerta}
              onPress={() => navigation.navigate("DetalheAlerta", { alertaId: alerta.id })}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
    padding: 16,
  },
  resumo: {
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    alignItems: "center",
  },
  resumoTexto: {
    color: "#FF5722",
    fontWeight: "bold",
    fontSize: 14,
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
});
