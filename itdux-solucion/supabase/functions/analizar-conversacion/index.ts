import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Respuestas fake por perfil detectado en el texto
function detectarPerfil(texto: string): string {
  const lower = texto.toLowerCase();
  if (lower.includes('contadora') || lower.includes('contador') || lower.includes('firma') || lower.includes('cartera')) return 'contadora';
  if (lower.includes('sucursal') || lower.includes('siat') || lower.includes('erp') || lower.includes('multa')) return 'empresario';
  if (lower.includes('instagram') || lower.includes('torta') || lower.includes('pastel') || lower.includes('redes sociales')) return 'emprendedora';
  return 'generico';
}

const RESPUESTAS: Record<string, object> = {
  emprendedora: {
    nombre: 'María Fernández',
    celular: '71234567',
    tipo_negocio: 'Pastelería',
    perfil_cliente: 'Emprendedora',
    score_conversion: 87,
    plan_recomendado: 'Básico',
    estado: 'nuevo',
    dolor_principal: 'Necesita facturación electrónica sencilla para regularizar su negocio',
    objecion_principal: 'Presupuesto limitado y temor a la complejidad tecnológica',
    resumen:
      'Prospecto interesada en comenzar con facturación electrónica. Vende por redes sociales y busca una solución sencilla, económica y con acompañamiento personalizado.',
    seguimiento: {
      accion: 'Enviar mensaje explicando el Plan Básico, destacar facilidad de uso y ofrecer acompañamiento en la primera factura',
      prioridad: 'alta',
    },
  },
  contadora: {
    nombre: 'Rosa Mamani',
    celular: '76543210',
    tipo_negocio: 'Firma Contable',
    perfil_cliente: 'Contadora independiente',
    score_conversion: 92,
    plan_recomendado: 'Profesional',
    estado: 'nuevo',
    dolor_principal: 'Necesita gestionar facturación de múltiples clientes desde una sola plataforma',
    objecion_principal: 'Requiere capacitación para su equipo y clientes',
    resumen:
      'Contadora con cartera de clientes que busca un plan multiruc. Alto potencial de conversión por volumen y perfil técnico. Requiere demostración del módulo multiruc.',
    seguimiento: {
      accion: 'Agendar demo del plan Profesional con módulo multiruc y enviar caso de éxito de otra contadora',
      prioridad: 'alta',
    },
  },
  empresario: {
    nombre: 'Rodrigo Vargas',
    celular: '79876543',
    tipo_negocio: 'Comercio multisucursal',
    perfil_cliente: 'Empresario PYME',
    score_conversion: 74,
    plan_recomendado: 'Empresarial',
    estado: 'nuevo',
    dolor_principal: 'Errores en facturación y riesgo de multas fiscales en sus sucursales',
    objecion_principal: 'Necesita integración con su ERP actual antes de decidir',
    resumen:
      'Empresario con múltiples sucursales que ya tuvo problemas con el SIAT. Perfil técnico, pregunta por integración API. Requiere propuesta personalizada con demostración de compatibilidad.',
    seguimiento: {
      accion: 'Enviar guía técnica de integración API y agendar llamada con el equipo técnico para evaluar compatibilidad con su ERP',
      prioridad: 'media',
    },
  },
  generico: {
    nombre: 'Prospecto Nuevo',
    celular: '70000000',
    tipo_negocio: 'Negocio general',
    perfil_cliente: 'Emprendedor',
    score_conversion: 65,
    plan_recomendado: 'Básico',
    estado: 'nuevo',
    dolor_principal: 'Necesita facturación electrónica para su negocio',
    objecion_principal: 'Evalúa costo-beneficio antes de decidir',
    resumen:
      'Prospecto interesado en facturación electrónica. Se recomienda presentar opciones de planes y casos de éxito similares a su rubro.',
    seguimiento: {
      accion: 'Enviar propuesta comercial con comparación de planes y solicitar reunión de 15 minutos',
      prioridad: 'media',
    },
  },
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { conversacion } = await req.json();

    if (!conversacion || typeof conversacion !== 'string') {
      return new Response(JSON.stringify({ error: 'El campo conversacion es requerido.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const perfil = detectarPerfil(conversacion);
    const resultado = RESPUESTAS[perfil] ?? RESPUESTAS['generico'];

    // Simular latencia de análisis IA (~800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
