import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SensorModulo } from "../types/sensor";

type Props = {
  sensor: SensorModulo;
  onPress: () => void;
};

export default function SensorCard({ sensor, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.nome}>{sensor.nome}</Text>
        <View style={[styles.status, sensor.ativo ? styles.ativo : styles.inativo]} />
      </View>
      <Text style={styles.detalhe}>Tipo: {sensor.tipo}</Text>
      <Text style={styles.detalhe}>Localização: {sensor.localizacao}</Text>
      <Text style={styles.hint}>Toque para registrar leitura</Text>
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
    borderLeftColor: "#00BFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E0F0FF",
    flex: 1,
  },
  status: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  ativo: {
    backgroundColor: "#4CAF50",
  },
  inativo: {
    backgroundColor: "#F44336",
  },
  detalhe: {
    fontSize: 13,
    color: "#90A4AE",
    marginTop: 2,
    textTransform: "capitalize",
  },
  hint: {
    fontSize: 11,
    color: "#00BFFF",
    marginTop: 8,
    opacity: 0.7,
  },
});
