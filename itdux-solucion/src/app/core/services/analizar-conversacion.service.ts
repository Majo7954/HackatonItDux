import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { AnalysisResult } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AnalizarConversacionService {
  private readonly supabase = inject(SupabaseService);

  async analizar(conversacion: string): Promise<AnalysisResult | null> {
    const { data, error } = await this.supabase.client.functions.invoke('analizar-conversacion', {
      body: { conversacion },
    });

    if (error) {
      console.error('Error calling edge function:', error.message);
      return null;
    }
    return data as AnalysisResult;
  }
}
