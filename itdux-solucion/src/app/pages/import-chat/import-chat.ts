import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnalizarConversacionService } from '../../core/services/analizar-conversacion.service';

const EJEMPLO_MARIA = `Cliente: Hola, vendo tortas por Instagram y me dijeron que necesito facturación electrónica.
Asesor: Claro 😊 Nosotros te ayudamos durante todo el proceso. ¿Cuánto tiempo llevas vendiendo?
Cliente: Unos 2 años. Pero nunca facturé. Tengo miedo de que sea complicado y tampoco tengo mucho presupuesto.
Asesor: Entiendo. Tenemos un plan básico muy accesible, ideal para emprendedoras como tú.
Cliente: ¿De verdad? ¿Puedo hacer facturas desde el celular?
Asesor: Sí, todo desde el celular. Te acompañamos en tu primera factura sin costo adicional.
Cliente: Me interesa. ¿Cuánto cuesta?`;

const EJEMPLO_ROSITA = `Cliente: Buenas, soy contadora y tengo varios clientes que necesitan facturación electrónica.
Asesor: ¡Hola! ¿Cuántos clientes tienes aproximadamente?
Cliente: Como 15 clientes, negocios pequeños. ¿Tienen algo para contadores que manejan varias empresas?
Asesor: Sí, tenemos un plan especial para contadores con acceso multiruc.
Cliente: Me parece interesante. ¿Cómo funciona el soporte?
Asesor: Soporte prioritario 24/7 y capacitación para ti y tus clientes.
Cliente: Perfecto, eso es lo que necesito.`;

const EJEMPLO_RODRIGO = `Cliente: Hola, tengo una tienda con 3 sucursales y me preocupan los errores en facturas.
Asesor: ¿Qué tipo de errores han tenido?
Cliente: Facturas duplicadas y problemas con el SIAT. Tuvimos una multa el mes pasado.
Asesor: Entiendo la urgencia. Nuestro plan profesional maneja multisucursal con validación SIAT en tiempo real.
Cliente: ¿Puede integrarse con mi sistema actual?
Asesor: Sí, tenemos API para integración. ¿Qué sistema usas?
Cliente: Usamos un ERP propio. Necesitaría ver si es compatible antes de decidir.`;

@Component({
  selector: 'app-import-chat',
  imports: [FormsModule, RouterLink],
  templateUrl: './import-chat.html',
  styleUrl: './import-chat.scss',
})
export class ImportChat {
  private readonly analizarSvc = inject(AnalizarConversacionService);
  private readonly router = inject(Router);

  conversacion = '';
  loading = signal(false);
  errorMsg = signal('');

  cargarEjemplo(tipo: 'maria' | 'rosita' | 'rodrigo') {
    const ejemplos = { maria: EJEMPLO_MARIA, rosita: EJEMPLO_ROSITA, rodrigo: EJEMPLO_RODRIGO };
    this.conversacion = ejemplos[tipo];
    this.errorMsg.set('');
  }

  async analizar() {
    if (!this.conversacion.trim()) {
      this.errorMsg.set('Pega o escribe una conversación antes de analizar.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const resultado = await this.analizarSvc.analizar(this.conversacion);

    this.loading.set(false);

    if (!resultado) {
      this.errorMsg.set('Error al analizar la conversación. Verifica la configuración de Supabase.');
      return;
    }

    sessionStorage.setItem('itdux_analysis', JSON.stringify(resultado));
    sessionStorage.setItem('itdux_conversacion', this.conversacion);

    this.router.navigate(['/resultado-ia']);
  }
}
