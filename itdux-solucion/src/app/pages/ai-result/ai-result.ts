import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProspectService } from '../../core/services/prospect.service';
import { ConversationService } from '../../core/services/conversation.service';
import { SeguimientoService } from '../../core/services/seguimiento.service';
import type { AnalysisResult } from '../../core/models/types';

@Component({
  selector: 'app-ai-result',
  imports: [FormsModule, RouterLink],
  templateUrl: './ai-result.html',
  styleUrl: './ai-result.scss',
})
export class AiResult implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly prospectSvc = inject(ProspectService);
  private readonly conversationSvc = inject(ConversationService);
  private readonly seguimientoSvc = inject(SeguimientoService);
  private readonly router = inject(Router);

  // Formulario editable — se pre-llena desde el resultado de la IA
  nombre = '';
  celular = '';
  tipo_negocio = '';
  perfil_cliente = '';
  score_conversion = 0;
  plan_recomendado = '';
  estado = 'nuevo';
  dolor_principal = '';
  objecion_principal = '';
  resumen = '';
  accion_seguimiento = '';
  prioridad_seguimiento = 'media';

  loading = signal(false);
  saving = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  ngOnInit() {
    const raw = sessionStorage.getItem('itdux_analysis');
    if (!raw) {
      this.errorMsg.set('No hay resultado de análisis. Importa una conversación primero.');
      return;
    }

    const data: AnalysisResult = JSON.parse(raw);
    this.nombre = data.nombre;
    this.celular = data.celular;
    this.tipo_negocio = data.tipo_negocio;
    this.perfil_cliente = data.perfil_cliente;
    this.score_conversion = data.score_conversion;
    this.plan_recomendado = data.plan_recomendado;
    this.estado = data.estado;
    this.dolor_principal = data.dolor_principal;
    this.objecion_principal = data.objecion_principal;
    this.resumen = data.resumen;
    this.accion_seguimiento = data.seguimiento?.accion ?? '';
    this.prioridad_seguimiento = data.seguimiento?.prioridad ?? 'media';
  }

  async guardar() {
    this.saving.set(true);
    this.errorMsg.set('');

    const user = await this.auth.getUser();
    if (!user) {
      this.errorMsg.set('Sesión expirada. Por favor inicia sesión nuevamente.');
      this.saving.set(false);
      return;
    }

    // 1. Crear prospecto
    const prospecto = await this.prospectSvc.createProspect({
      advisor_id: user.id,
      nombre: this.nombre,
      celular: this.celular,
      tipo_negocio: this.tipo_negocio,
      perfil_cliente: this.perfil_cliente,
      score_conversion: this.score_conversion,
      plan_recomendado: this.plan_recomendado,
      estado: this.estado,
    });

    if (!prospecto?.id) {
      this.errorMsg.set('Error al guardar el prospecto. Verifica tu conexión con Supabase.');
      this.saving.set(false);
      return;
    }

    // 2. Guardar conversación
    const conversacionTexto = sessionStorage.getItem('itdux_conversacion') ?? '';
    await this.conversationSvc.createConversation({
      prospect_id: prospecto.id,
      contenido: conversacionTexto,
      dolor_principal: this.dolor_principal,
      objecion_principal: this.objecion_principal,
      resumen: this.resumen,
    });

    // 3. Crear seguimiento
    const fechaRecordatorio = new Date();
    fechaRecordatorio.setDate(fechaRecordatorio.getDate() + 1);

    await this.seguimientoSvc.createSeguimiento({
      prospecto_id: prospecto.id,
      asesor_id: user.id,
      accion: this.accion_seguimiento,
      fecha_recordatorio: fechaRecordatorio.toISOString(),
      estado: 'pendiente',
      prioridad: this.prioridad_seguimiento,
    });

    // 4. Limpiar sesión y navegar
    sessionStorage.removeItem('itdux_analysis');
    sessionStorage.removeItem('itdux_conversacion');

    this.saving.set(false);
    this.successMsg.set('¡Prospecto guardado exitosamente!');

    setTimeout(() => this.router.navigate(['/dashboard']), 1200);
  }
}
