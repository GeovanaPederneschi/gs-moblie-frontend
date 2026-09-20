import axios from "axios";
import { Platform } from "react-native";

/**
 * BASE_URL da API:
 * - Web / iOS (simulador): http://localhost:8080
 * - Emulador Android: http://10.0.2.2:8080 (o emulador não enxerga o "localhost" da máquina host)
 * - Celular físico: defina EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080 antes de rodar o Expo
 */
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
