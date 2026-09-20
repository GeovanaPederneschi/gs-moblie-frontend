import { SensorModulo } from "./sensor";

export type NivelCriticidade = "baixo" | "medio" | "alto" | "critico";

export type AlertaCritico = {
  id: number;
  sensor: SensorModulo;
  descricao: string;
  tipoAlerta: string;
  nivelCriticidade: NivelCriticidade;
  resolvido: boolean;
  timestamp: string;
};

export type NovoAlerta = {
  sensorId: number;
  descricao: string;
  tipoAlerta: string;
  nivelCriticidade: NivelCriticidade;
  resolvido: boolean;
  timestamp: string;
};
