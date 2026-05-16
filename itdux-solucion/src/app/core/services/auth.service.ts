import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import type { AuthError, User, Session } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  async login(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    return { error };
  }

  async logout(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.router.navigate(['/login']);
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.client.auth.getUser();
    return data.user;
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.client.auth.getSession();
    return data.session;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.client.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }
}
