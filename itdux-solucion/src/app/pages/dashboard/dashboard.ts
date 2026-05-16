import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdvisorService } from '../../core/services/advisor.service';
import { ProspectService } from '../../core/services/prospect.service';
import { SeguimientoService } from '../../core/services/seguimiento.service';
import type { Advisor, Prospect, Seguimiento, DashboardMetrics } from '../../core/models/types';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly advisorSvc = inject(AdvisorService);
  private readonly prospectSvc = inject(ProspectService);
  private readonly seguimientoSvc = inject(SeguimientoService);

  advisor = signal<Advisor | null>(null);
  prospects = signal<Prospect[]>([]);
  seguimientos = signal<Seguimiento[]>([]);
  loading = signal(true);

  metrics = signal<DashboardMetrics>({
    total: 0,
    alta_prioridad: 0,
    sin_seguimiento: 0,
    convertidos: 0,
  });

  readonly today = new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'short' });

  async ngOnInit() {
    const user = await this.auth.getUser();
    if (!user) return;

    const [advisorData, prospectsData, seguimientosData] = await Promise.all([
      this.advisorSvc.getAdvisor(user.id),
      this.prospectSvc.getProspects(user.id),
      this.seguimientoSvc.getSeguimientos(user.id),
    ]);

    this.advisor.set(advisorData);
    this.prospects.set(prospectsData);
    this.seguimientos.set(seguimientosData);

    this.metrics.set({
      total: prospectsData.length,
      alta_prioridad: seguimientosData.filter((s) => s.prioridad === 'alta').length,
      sin_seguimiento: prospectsData.filter((p) => p.estado === 'nuevo').length,
      convertidos: prospectsData.filter((p) => p.estado === 'convertido').length,
    });

    this.loading.set(false);
  }

  get urgentSeguimientos(): Seguimiento[] {
    return this.seguimientos().filter((s) => s.prioridad === 'alta').slice(0, 3);
  }

  get recentProspects(): Prospect[] {
    return this.prospects().slice(0, 3);
  }

  initials(nombre: string): string {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  async logout() {
    await this.auth.logout();
  }
}
