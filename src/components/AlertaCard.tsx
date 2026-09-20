import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlertaCritico } from "../types/alerta";

type Props = {
  alerta: AlertaCritico;
  onPress: () => void;
};

const corCriticidade: Record<string, string> = {
  critico: "#F44336",
  alto: "#FF5722",
  medio: "#FF9800",
  baixo: "#4CAF50",
};

export default function AlertaCard({ alerta, onPress }: Props) {
  const cor = corCriticidade[alerta.nivelCriticidade] ?? "#90A4AE";

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: cor }]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.descricao} numberOfLines={2}>{alerta.descricao}</Text>
        <View style={[styles.badge, alerta.resolvido ? styles.resolvido : styles.ativo]}>
          <Text style={styles.badgeText}>{alerta.resolvido ? "Resolvido" : "Ativo"}</Text>
        </View>
      </View>
      <Text style={styles.tipo}>Tipo: {alerta.tipoAlerta}</Text>
      <View style={styles.criticidadeRow}>
        <View style={[styles.criticidadeBadge, { backgroundColor: cor }]}>
          <Text style={styles.criticidadeText}>{alerta.nivelCriticidade.toUpperCase()}</Text>
        </View>
        <Text style={styles.sensor}>{alerta.sensor.nome}</Text>
      </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  descricao: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E0F0FF",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  resolvido: {
    backgroundColor: "#4CAF50",
  },
  ativo: {
    backgroundColor: "#F44336",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  tipo: {
    fontSize: 12,
    color: "#90A4AE",
    marginBottom: 8,
  },
  criticidadeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criticidadeBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  criticidadeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sensor: {
    fontSize: 12,
    color: "#78909C",
  },
});
