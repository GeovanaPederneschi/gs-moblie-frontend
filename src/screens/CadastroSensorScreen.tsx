import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { TipoSensor } from "../types/sensor";
import * as sensorService from "../services/sensorService";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CadastroSensor">;
};

const TIPOS: TipoSensor[] = ["temperatura", "pressao", "radiacao", "navegacao"];

export default function CadastroSensorScreen({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoSensor | "">("");
  const [localizacao, setLocalizacao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const { height } = useWindowDimensions();

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      await sensorService.criar({ nome, tipo: tipo as TipoSensor, localizacao, ativo });
      navigation.goBack();
    } catch {
      setErro("Erro ao salvar sensor. Verifique a conexão com a API.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: "#0D1B2A" }} contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Sensor *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Sensor Temp Módulo A"
        placeholderTextColor="#546E7A"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.tiposRow}>
        {TIPOS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tipoBotao, tipo === t && styles.tipoSelecionado]}
            onPress={() => setTipo(t)}
          >
            <Text style={[styles.tipoTexto, tipo === t && styles.tipoTextoSelecionado]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Localização *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Módulo Habitation — Setor B"
        placeholderTextColor="#546E7A"
        value={localizacao}
        onChangeText={setLocalizacao}
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.tiposRow}>
        <TouchableOpacity
          style={[styles.tipoBotao, ativo && styles.tipoSelecionado]}
          onPress={() => setAtivo(true)}
        >
          <Text style={[styles.tipoTexto, ativo && styles.tipoTextoSelecionado]}>Ativo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipoBotao, !ativo && styles.tipoSelecionadoVermelho]}
          onPress={() => setAtivo(false)}
        >
          <Text style={[styles.tipoTexto, !ativo && styles.tipoTextoSelecionado]}>Inativo</Text>
        </TouchableOpacity>
      </View>

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      {nome !== "" && tipo !== "" && localizacao !== "" && (
        <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#0D1B2A" />
          ) : (
            <Text style={styles.btnSalvarText}>Salvar Sensor</Text>
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
  tiposRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tipoBotao: {
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tipoSelecionado: {
    backgroundColor: "#00BFFF",
    borderColor: "#00BFFF",
  },
  tipoSelecionadoVermelho: {
    backgroundColor: "#F44336",
    borderColor: "#F44336",
  },
  tipoTexto: {
    color: "#90A4AE",
    fontSize: 13,
    textTransform: "capitalize",
  },
  tipoTextoSelecionado: {
    color: "#0D1B2A",
    fontWeight: "bold",
  },
  erro: {
    color: "#F44336",
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
  },
  btnSalvar: {
    backgroundColor: "#00BFFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  btnSalvarText: {
    color: "#0D1B2A",
    fontWeight: "bold",
    fontSize: 16,
  },
});
