import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { AlertaCritico } from "../types/alerta";
import * as alertaService from "../services/alertaService";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "DetalheAlerta">;
  route: RouteProp<RootStackParamList, "DetalheAlerta">;
};

const corCriticidade: Record<string, string> = {
  critico: "#F44336",
  alto: "#FF5722",
  medio: "#FF9800",
  baixo: "#4CAF50",
};

export default function DetalheAlertaScreen({ navigation, route }: Props) {
  const { alertaId } = route.params;

  const [alerta, setAlerta] = useState<AlertaCritico | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resolvendo, setResolvendo] = useState(false);

  useEffect(() => {
    carregarAlerta();
  }, [alertaId]);

  async function carregarAlerta() {
    setLoading(true);
    setErro("");
    try {
      const dados = await alertaService.buscarPorId(alertaId);
      setAlerta(dados);
    } catch {
      setErro("Erro ao carregar alerta. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  }

  async function resolverAlerta() {
    if (!alerta) return;
    setResolvendo(true);
    setErro("");
    try {
      await alertaService.resolver(alerta);
      navigation.goBack();
    } catch {
      setErro("Erro ao resolver alerta. Verifique a conexão com a API.");
      setResolvendo(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color="#F44336" />
      </View>
    );
  }

  if (erro !== "" && !alerta) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  if (!alerta) {
    return null;
  }

  const cor = corCriticidade[alerta.nivelCriticidade] ?? "#90A4AE";
  const dataFormatada = new Date(alerta.timestamp).toLocaleString("pt-BR");

  return (
    <ScrollView style={{ backgroundColor: "#0D1B2A" }} contentContainerStyle={styles.container}>
      <View style={[styles.criticidadeHeader, { backgroundColor: cor }]}>
        <Text style={styles.criticidadeLabel}>Nível de Criticidade</Text>
        <Text style={styles.criticidadeValor}>{alerta.nivelCriticidade.toUpperCase()}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Descrição</Text>
        <Text style={styles.campoValor}>{alerta.descricao}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Tipo do Alerta</Text>
        <Text style={styles.campoValor}>{alerta.tipoAlerta}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Sensor</Text>
        <Text style={styles.campoValor}>{alerta.sensor.nome}</Text>
        <Text style={styles.campoSub}>
          {alerta.sensor.tipo} — {alerta.sensor.localizacao}
        </Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Data / Hora</Text>
        <Text style={styles.campoValor}>{dataFormatada}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Status</Text>
        <View
          style={[
            styles.statusBadge,
            alerta.resolvido ? styles.statusResolvido : styles.statusAtivo,
          ]}
        >
          <Text style={styles.statusTexto}>
            {alerta.resolvido ? "Resolvido" : "Ativo — requer atenção"}
          </Text>
        </View>
      </View>

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      {!alerta.resolvido && (
        <TouchableOpacity
          style={styles.btnResolver}
          onPress={resolverAlerta}
          disabled={resolvendo}
        >
          {resolvendo ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnResolverText}>Marcar como Resolvido</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  criticidadeHeader: {
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  criticidadeLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  criticidadeValor: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  campo: {
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  campoLabel: {
    color: "#546E7A",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  campoValor: {
    color: "#E0F0FF",
    fontSize: 15,
  },
  campoSub: {
    color: "#78909C",
    fontSize: 12,
    marginTop: 2,
    textTransform: "capitalize",
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statusAtivo: {
    backgroundColor: "#F44336",
  },
  statusResolvido: {
    backgroundColor: "#4CAF50",
  },
  statusTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  erro: {
    color: "#F44336",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },
  btnResolver: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  btnResolverText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
