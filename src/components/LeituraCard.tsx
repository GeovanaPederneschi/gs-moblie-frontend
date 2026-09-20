import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LeituraSensor } from "../types/leitura";

type Props = {
  leitura: LeituraSensor;
  onPress: () => void;
};

const corStatus: Record<string, string> = {
  normal: "#4CAF50",
  atencao: "#FF9800",
  critico: "#F44336",
};

export default function LeituraCard({ leitura, onPress }: Props) {
  const cor = corStatus[leitura.statusOperacional] ?? "#90A4AE";
  const data = new Date(leitura.timestamp).toLocaleString("pt-BR");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.sensor}>{leitura.sensor.nome}</Text>
        <View style={[styles.badge, { backgroundColor: cor }]}>
          <Text style={styles.badgeText}>{leitura.statusOperacional.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.valor}>
        {leitura.valor} <Text style={styles.unidade}>{leitura.unidade}</Text>
      </Text>
      <Text style={styles.timestamp}>{data}</Text>
      {leitura.observacoes ? (
        <Text style={styles.obs}>Obs: {leitura.observacoes}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E2A3A",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#7C4DFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sensor: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#E0F0FF",
    flex: 1,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  valor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E0F0FF",
    marginBottom: 4,
  },
  unidade: {
    fontSize: 14,
    color: "#90A4AE",
    fontWeight: "normal",
  },
  timestamp: {
    fontSize: 12,
    color: "#546E7A",
    marginTop: 4,
  },
  obs: {
    fontSize: 12,
    color: "#90A4AE",
    marginTop: 4,
    fontStyle: "italic",
  },
});
