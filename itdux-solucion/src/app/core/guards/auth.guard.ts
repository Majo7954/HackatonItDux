import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  if (!supabase.isBrowser) return true;

  const auth = inject(AuthService);
  const session = await auth.getSession();

  if (session) return true;

  router.navigate(['/login']);
  return false;
};
