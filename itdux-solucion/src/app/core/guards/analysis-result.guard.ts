import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const analysisResultGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  if (!supabase.isBrowser) return true;

  if (sessionStorage.getItem('itdux_analysis')) {
    return true;
  }

  router.navigate(['/importar']);
  return false;
};
