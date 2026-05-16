import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { Advisor } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AdvisorService {
  private readonly supabase = inject(SupabaseService);

  async getAdvisor(userId: string): Promise<Advisor | null> {
    const { data, error } = await this.supabase.client
      .from('advisors')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching advisor:', error.message);
      return null;
    }
    return data as Advisor;
  }
}
