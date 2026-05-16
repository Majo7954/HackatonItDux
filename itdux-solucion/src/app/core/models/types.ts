export interface Advisor {
  id: string;
  nombre: string;
  correo: string;
  celular: string;
  created_at: string;
}

export interface Prospect {
  id?: string;
  advisor_id: string;
  nombre: string;
  celular: string;
  tipo_negocio: string;
  perfil_cliente: string;
  score_conversion: number;
  plan_recomendado: string;
  estado: string;
  created_at?: string;
}

export interface Conversation {
  id?: string;
  prospect_id: string;
  contenido: string;
  dolor_principal: string;
  objecion_principal: string;
  resumen: string;
}

export interface Seguimiento {
  id?: string;
  prospecto_id: string;
  asesor_id: string;
  accion: string;
  fecha_recordatorio?: string;
  estado: string;
  prioridad: string;
  prospects?: { nombre: string; tipo_negocio: string };
}

export interface AnalysisResult {
  nombre: string;
  celular: string;
  tipo_negocio: string;
  perfil_cliente: string;
  score_conversion: number;
  plan_recomendado: string;
  estado: string;
  dolor_principal: string;
  objecion_principal: string;
  resumen: string;
  seguimiento: {
    accion: string;
    prioridad: string;
  };
}

export interface DashboardMetrics {
  total: number;
  alta_prioridad: number;
  sin_seguimiento: number;
  convertidos: number;
}
