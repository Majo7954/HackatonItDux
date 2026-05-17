import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { Seguimiento } from '../models/types';

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  private readonly supabase = inject(SupabaseService);

  async createSeguimiento(seguimiento: Omit<Seguimiento, 'id' | 'prospects'>): Promise<Seguimiento | null> {
    const { data, error } = await this.supabase.client
      .from('seguimientos')
      .insert(seguimiento)
      .select()
      .single();

    if (error) {
      console.error('Error creating seguimiento:', error.message);
      return null;
    }
    return data as Seguimiento;
  }

  async getSeguimientos(asesorId: string): Promise<Seguimiento[]> {
    const { data, error } = await this.supabase.client
      .from('seguimientos')
      .select('*, prospects(nombre, tipo_negocio)')
      .eq('asesor_id', asesorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seguimientos:', error.message);
      return [];
    }
    return (data as Seguimiento[]) ?? [];
  }

  async getSeguimientosByProspectId(prospectId: string, advisorId: string): Promise<Seguimiento[]> {
    const { data, error } = await this.supabase.client
      .from('seguimientos')
      .select('*')
      .eq('prospecto_id', prospectId)
      .eq('asesor_id', advisorId)
      .order('fecha_recordatorio', { ascending: true });

    if (error) {
      console.error('Error fetching seguimientos by prospect id:', error.message);
      return [];
    }
    return (data as Seguimiento[]) ?? [];
  }
}
