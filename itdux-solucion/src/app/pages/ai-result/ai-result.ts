import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { ProspectService } from '../../core/services/prospect.service';
import { ConversationService } from '../../core/services/conversation.service';
import { SeguimientoService } from '../../core/services/seguimiento.service';

@Component({
  selector: 'app-ai-result',
  imports: [FormsModule, RouterLink, Sidebar],
  templateUrl: './ai-result.html',
  styleUrl: './ai-result.scss',
})
export class AiResult implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly prospectSvc = inject(ProspectService);
  private readonly conversationSvc = inject(ConversationService);
  private readonly seguimientoSvc = inject(SeguimientoService);
  private readonly router = inject(Router);

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
    console.log('📋 Inicializando ai-result...');

    const raw = sessionStorage.getItem('itdux_analysis');

    if (!raw) {
      this.errorMsg.set('No hay resultado de análisis. Importa una conversación primero.');
      return;
    }

    try {
      const data: any = JSON.parse(raw);

      console.log('🔍 RAW SESSION:', raw);
      console.log('🔍 DATA COMPLETA AI RESULT:', data);

      this.nombre = data.nombre ?? data.name ?? '';
      this.celular = data.celular ?? data.whatsapp ?? data.telefono ?? data.phone ?? '';
      this.tipo_negocio = data.tipo_negocio ?? data.tipoNegocio ?? data.negocio ?? data.business_type ?? '';
      this.perfil_cliente = data.perfil_cliente ?? data.perfilCliente ?? data.perfil ?? data.customer_profile ?? '';
      this.score_conversion = Number(data.score_conversion ?? data.score ?? data.scoreConversion ?? 0);
      this.plan_recomendado = data.plan_recomendado ?? data.planRecomendado ?? data.plan ?? '';
      this.estado = data.estado ?? data.status ?? 'nuevo';
      this.dolor_principal = data.dolor_principal ?? data.dolorPrincipal ?? data.dolor ?? data.pain_point ?? '';
      this.objecion_principal = data.objecion_principal ?? data.objecionPrincipal ?? data.objecion ?? data.objection ?? '';
      this.resumen = data.resumen ?? data.summary ?? '';

      this.accion_seguimiento =
        data.seguimiento?.accion ??
        data.follow_up?.action ??
        data.accion_seguimiento ??
        data.accionSeguimiento ??
        '';

      this.prioridad_seguimiento =
        data.seguimiento?.prioridad ??
        data.follow_up?.priority ??
        data.prioridad_seguimiento ??
        data.prioridadSeguimiento ??
        'media';

      console.log('✅ Campos cargados en pantalla:', {
        nombre: this.nombre,
        celular: this.celular,
        tipo_negocio: this.tipo_negocio,
        perfil_cliente: this.perfil_cliente,
        score_conversion: this.score_conversion,
        plan_recomendado: this.plan_recomendado,
        estado: this.estado,
        dolor_principal: this.dolor_principal,
        objecion_principal: this.objecion_principal,
        resumen: this.resumen,
        accion_seguimiento: this.accion_seguimiento,
        prioridad_seguimiento: this.prioridad_seguimiento,
      });

      if (!this.nombre && !this.celular) {
        console.warn('⚠️ La respuesta no trae nombre/celular. Revisa la Edge Function.');
      }
    } catch (err) {
      console.error('❌ Error parseando sessionStorage:', err);
      this.errorMsg.set('Error al cargar el análisis. El formato de datos es inválido.');
    }
  }

  async guardar() {
    console.log('💾 Iniciando guardado de prospecto...');
    this.saving.set(true);
    this.errorMsg.set('');

    const user = await this.auth.getUser();

    if (!user) {
      this.errorMsg.set('Sesión expirada. Por favor inicia sesión nuevamente.');
      this.saving.set(false);
      return;
    }

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

    const conversacionTexto = sessionStorage.getItem('itdux_conversacion') ?? '';

    await this.conversationSvc.createConversation({
      prospect_id: prospecto.id,
      contenido: conversacionTexto,
      dolor_principal: this.dolor_principal,
      objecion_principal: this.objecion_principal,
      resumen: this.resumen,
    });

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

    sessionStorage.removeItem('itdux_analysis');
    sessionStorage.removeItem('itdux_conversacion');

    this.saving.set(false);
    this.successMsg.set('¡Prospecto guardado exitosamente!');

    setTimeout(() => this.router.navigate(['/dashboard']), 1200);
  }
}