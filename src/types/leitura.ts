import { SensorModulo } from "./sensor";

export type StatusOperacional = "normal" | "atencao" | "critico";

export type LeituraSensor = {
  id: number;
  sensor: SensorModulo;
  valor: number;
  unidade: string;
  statusOperacional: StatusOperacional;
  timestamp: string;
  observacoes?: string;
};

export type NovaLeitura = {
  sensorId: number;
  valor: number;
  unidade: string;
  statusOperacional: StatusOperacional;
  timestamp: string;
  observacoes?: string | null;
};
