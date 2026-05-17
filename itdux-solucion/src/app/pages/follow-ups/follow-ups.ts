import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { SeguimientoService } from '../../core/services/seguimiento.service';
import type { Seguimiento } from '../../core/models/types';

@Component({
  selector: 'app-follow-ups',
  imports: [RouterLink, Sidebar],
  templateUrl: './follow-ups.html',
  styleUrl: './follow-ups.scss',
})
export class FollowUps implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly seguimientoSvc = inject(SeguimientoService);

  seguimientos = signal<Seguimiento[]>([]);
  loading = signal(true);

  alta = computed(() => this.seguimientos().filter((s) => s.prioridad === 'alta'));
  media = computed(() => this.seguimientos().filter((s) => s.prioridad === 'media'));
  baja = computed(() => this.seguimientos().filter((s) => s.prioridad === 'baja'));
  completados = computed(() => this.seguimientos().filter((s) => s.estado === 'completado'));

  async ngOnInit() {
    const user = await this.auth.getUser();
    if (!user) return;

    const data = await this.seguimientoSvc.getSeguimientos(user.id);
    this.seguimientos.set(data);
    this.loading.set(false);
  }

  initials(nombre: string): string {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatFecha(iso?: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' });
  }
}
