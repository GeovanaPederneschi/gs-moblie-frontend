import api from "./api";
import { AlertaCritico, NovoAlerta } from "../types/alerta";

export async function listar(): Promise<AlertaCritico[]> {
  const { data } = await api.get<AlertaCritico[]>("/alertas");
  return data;
}

export async function buscarPorId(id: number): Promise<AlertaCritico> {
  const { data } = await api.get<AlertaCritico>(`/alertas/${id}`);
  return data;
}

export async function criar(alerta: NovoAlerta): Promise<AlertaCritico> {
  const { sensorId, ...resto } = alerta;
  const { data } = await api.post<AlertaCritico>("/alertas", {
    ...resto,
    sensor: { id: sensorId },
  });
  return data;
}

export async function resolver(alerta: AlertaCritico): Promise<AlertaCritico> {
  const { data } = await api.put<AlertaCritico>(`/alertas/${alerta.id}`, {
    ...alerta,
    sensor: { id: alerta.sensor.id },
    resolvido: true,
  });
  return data;
}
