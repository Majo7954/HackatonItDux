import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { AnalysisResult } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AnalizarConversacionService {
  private readonly supabase = inject(SupabaseService);

  async analizar(conversacion: string): Promise<AnalysisResult | null> {
    // Validar entrada
    if (!conversacion || conversacion.trim().length === 0) {
      console.error('Error: conversación vacía');
      return null;
    }

    console.log('📤 Conversación enviada:', conversacion.substring(0, 200) + '...');

    try {
      const { data, error } = await this.supabase.client.functions.invoke('analizar-conversacion', {
        body: { conversacion },
      });

      if (error) {
        console.error('❌ Error calling edge function:', error.message);
        return null;
      }

      // Validar estructura de respuesta
      if (!data) {
        console.error('❌ Error: la Edge Function devolvió datos vacíos');
        return null;
      }

      // Verificar que tenga los campos requeridos
      const requiredFields = [
        'nombre',
        'celular',
        'tipo_negocio',
        'perfil_cliente',
        'score_conversion',
        'plan_recomendado',
        'estado',
        'dolor_principal',
        'objecion_principal',
        'resumen',
      ];

      for (const field of requiredFields) {
        if (!(field in data)) {
          console.warn(`⚠️ Campo faltante en respuesta: ${field}`);
        }
      }

      // Validar seguimiento
      if (!data.seguimiento || typeof data.seguimiento !== 'object') {
        console.warn('⚠️ Campo seguimiento faltante o inválido, usando valores por defecto');
        data.seguimiento = { accion: '', prioridad: 'media' };
      }

      console.log('✅ Resultado IA recibido:', data);
      return data as AnalysisResult;
    } catch (err) {
      console.error('❌ Error en analizar():', err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  }
}
