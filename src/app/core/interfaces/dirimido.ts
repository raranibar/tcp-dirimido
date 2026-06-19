export interface DirimidoResponse {
  idDirimido: number;
  idExpediente: number;
  numero: string;
  nombreRelator: string;
  nombreFavor: string;
  //dirimidoAFavor: string;
}

export interface ExpedienteResponse {
  idResolucion: number,
  idExpediente: number;
  numeroExpediente: string;
  numero: string;
  referencia: string,
  tipoResolucion: string,
  idMagistrado: number,
  magistradoRelator: string;
  magistradoCorrelator: string;
}

export interface MagistradoResponse {
  idMagistrado: number;
  nombre: string;
}

export interface DirimidoRequest {
  idExpediente: number;
  numero: string;
  idMagistradoPresidente: number;
  idMagistradoRelator: number;
  idMagistradoDirimeFavor: number;
}