import api from "./api";
import { LeituraSensor, NovaLeitura } from "../types/leitura";

export async function listar(): Promise<LeituraSensor[]> {
  const { data } = await api.get<LeituraSensor[]>("/leituras");
  return data;
}

export async function buscarPorId(id: number): Promise<LeituraSensor> {
  const { data } = await api.get<LeituraSensor>(`/leituras/${id}`);
  return data;
}

export async function criar(leitura: NovaLeitura): Promise<LeituraSensor> {
  const { sensorId, ...resto } = leitura;
  const { data } = await api.post<LeituraSensor>("/leituras", {
    ...resto,
    sensor: { id: sensorId },
  });
  return data;
}
