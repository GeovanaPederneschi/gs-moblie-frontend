export type TipoSensor = "temperatura" | "pressao" | "radiacao" | "navegacao";

export type SensorModulo = {
  id: number;
  nome: string;
  tipo: TipoSensor;
  localizacao: string;
  ativo: boolean;
};
