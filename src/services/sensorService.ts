import api from "./api";
import { SensorModulo } from "../types/sensor";

export async function listar(): Promise<SensorModulo[]> {
  const { data } = await api.get<SensorModulo[]>("/sensores");
  return data;
}

export async function buscarPorId(id: number): Promise<SensorModulo> {
  const { data } = await api.get<SensorModulo>(`/sensores/${id}`);
  return data;
}

export async function criar(sensor: Omit<SensorModulo, "id">): Promise<SensorModulo> {
  const { data } = await api.post<SensorModulo>("/sensores", sensor);
  return data;
}
