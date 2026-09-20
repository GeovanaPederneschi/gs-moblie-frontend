import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { StatusOperacional } from "../types/leitura";
import * as leituraService from "../services/leituraService";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CadastroLeitura">;
  route: RouteProp<RootStackParamList, "CadastroLeitura">;
};

const STATUS: StatusOperacional[] = ["normal", "atencao", "critico"];

const corStatus: Record<StatusOperacional, string> = {
  normal: "#4CAF50",
  atencao: "#FF9800",
  critico: "#F44336",
};

export default function CadastroLeituraScreen({ navigation, route }: Props) {
  const { sensorId, sensorNome } = route.params;

  const [valor, setValor] = useState("");
  const [unidade, setUnidade] = useState("");
  const [status, setStatus] = useState<StatusOperacional | "">("");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      await leituraService.criar({
        sensorId,
        valor: Number(valor),
        unidade,
        statusOperacional: status as StatusOperacional,
        timestamp: new Date().toISOString().slice(0, 19),
        observacoes: observacoes || null,
      });
      navigation.goBack();
    } catch {
      setErro("Erro ao salvar leitura. Verifique a conexão com a API.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: "#0D1B2A" }} contentContainerStyle={styles.container}>
      <View style={styles.sensorInfo}>
        <Text style={styles.sensorLabel}>Sensor</Text>
        <Text style={styles.sensorNome}>{sensorNome}</Text>
        <Text style={styles.sensorId}>ID: {sensorId}</Text>
      </View>

      <Text style={styles.label}>Valor Medido *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 23.5"
        placeholderTextColor="#546E7A"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Unidade *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: °C, kPa, mSv/h"
        placeholderTextColor="#546E7A"
        value={unidade}
        onChangeText={setUnidade}
      />

      <Text style={styles.label}>Status Operacional *</Text>
      <View style={styles.statusRow}>
        {STATUS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.statusBotao,
              status === s && { backgroundColor: corStatus[s], borderColor: corStatus[s] },
            ]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.statusTexto, status === s && styles.statusTextoSelecionado]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Observações adicionais (opcional)"
        placeholderTextColor="#546E7A"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        numberOfLines={3}
      />

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      {valor !== "" && unidade !== "" && status !== "" && (
        <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#0D1B2A" />
          ) : (
            <Text style={styles.btnSalvarText}>Registrar Leitura</Text>
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
  sensorInfo: {
    backgroundColor: "#1E2A3A",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#7C4DFF",
  },
  sensorLabel: {
    color: "#546E7A",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sensorNome: {
    color: "#E0F0FF",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 2,
  },
  sensorId: {
    color: "#546E7A",
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    color: "#90A4AE",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#1E2A3A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#E0F0FF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#263545",
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusBotao: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  statusTexto: {
    color: "#90A4AE",
    fontSize: 13,
    textTransform: "capitalize",
  },
  statusTextoSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  erro: {
    color: "#F44336",
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
  },
  btnSalvar: {
    backgroundColor: "#7C4DFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  btnSalvarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
