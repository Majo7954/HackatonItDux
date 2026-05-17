import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { ProspectService } from '../../core/services/prospect.service';
import { ConversationService } from '../../core/services/conversation.service';
import { SeguimientoService } from '../../core/services/seguimiento.service';
import type { Conversation, Prospect, Seguimiento } from '../../core/models/types';

@Component({
  selector: 'app-prospect-profile',
  imports: [RouterLink, Sidebar],
  templateUrl: './prospect-profile.html',
  styleUrl: './prospect-profile.scss',
})
export class ProspectProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly prospectSvc = inject(ProspectService);
  private readonly conversationSvc = inject(ConversationService);
  private readonly seguimientoSvc = inject(SeguimientoService);

  loading = signal(true);
  errorMsg = signal('');
  prospect = signal<Prospect | null>(null);
  conversation = signal<Conversation | null>(null);
  seguimientos = signal<Seguimiento[]>([]);

  ngOnInit() {
    this.loadProspectDetails();
  }

  async loadProspectDetails() {
    const prospectId = this.route.snapshot.paramMap.get('id');
    if (!prospectId) {
      await this.router.navigate(['/dashboard']);
      return;
    }

    const user = await this.auth.getUser();
    if (!user || !user.id) {
      await this.router.navigate(['/login']);
      return;
    }

    const advisorId = user.id;
    const prospect = await this.prospectSvc.getProspectById(prospectId, advisorId);

    if (!prospect) {
      this.errorMsg.set('Prospecto no encontrado o no pertenece a esta cuenta.');
      this.loading.set(false);
      return;
    }

    this.prospect.set(prospect);

    const conversation = await this.conversationSvc.getConversationByProspectId(prospectId);
    this.conversation.set(conversation);

    const seguimientos = await this.seguimientoSvc.getSeguimientosByProspectId(prospectId, advisorId);
    this.seguimientos.set(seguimientos);

    this.loading.set(false);
  }

  initials(value: string) {
    return value
      .split(' ')
      .filter((part) => part.length > 0)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatShortDate(value?: string | null) {
    if (!value) {
      return 'Sin fecha';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
