import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { Prospect } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ProspectService {
  private readonly supabase = inject(SupabaseService);

  async createProspect(prospect: Omit<Prospect, 'id' | 'created_at'>): Promise<Prospect | null> {
    const { data, error } = await this.supabase.client
      .from('prospects')
      .insert(prospect)
      .select()
      .single();

    if (error) {
      console.error('Error creating prospect:', error.message);
      return null;
    }
    return data as Prospect;
  }

  async getProspects(advisorId: string): Promise<Prospect[]> {
    const { data, error } = await this.supabase.client
      .from('prospects')
      .select('*')
      .eq('advisor_id', advisorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prospects:', error.message);
      return [];
    }
    return (data as Prospect[]) ?? [];
  }
}
