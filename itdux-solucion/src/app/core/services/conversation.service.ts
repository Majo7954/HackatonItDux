import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { Conversation } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly supabase = inject(SupabaseService);

  async createConversation(conversation: Omit<Conversation, 'id'>): Promise<Conversation | null> {
    const { data, error } = await this.supabase.client
      .from('conversations')
      .insert(conversation)
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error.message);
      return null;
    }
    return data as Conversation;
  }

  async getConversationByProspectId(prospectId: string): Promise<Conversation | null> {
    const { data, error } = await this.supabase.client
      .from('conversations')
      .select('*')
      .eq('prospect_id', prospectId)
      .single();

    if (error) {
      console.error('Error fetching conversation by prospect id:', error.message);
      return null;
    }
    return data as Conversation;
  }
}
