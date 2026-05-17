import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AnalizarConversacionService } from '../../core/services/analizar-conversacion.service';
import JSZip from 'jszip';

@Component({
  selector: 'app-import-chat',
  imports: [FormsModule, RouterLink, Sidebar],
  templateUrl: './import-chat.html',
  styleUrl: './import-chat.scss',
})
export class ImportChat implements OnInit {
  private readonly analizarSvc = inject(AnalizarConversacionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  conversacion = '';
  loading = signal(false);
  errorMsg = signal('');
  fileName = signal<string | null>(null);
  fileLoading = signal(false);
  prospectId: string | null = null;

  ngOnInit() {
    const prospectId = this.route.snapshot.queryParamMap.get('prospectId');
    if (prospectId) {
      this.prospectId = prospectId;
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.fileLoading.set(true);
    this.errorMsg.set('');
    this.fileName.set(file.name);

    try {
      const content = await this.extractFileContent(file);
      if (content) {
        this.conversacion = content;
      }
    } catch (error) {
      this.errorMsg.set(
        `Error al leer archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
      this.fileName.set(null);
    } finally {
      this.fileLoading.set(false);
      // Limpiar el input para permitir cargar el mismo archivo otra vez
      input.value = '';
    }
  }

  private async extractFileContent(file: File): Promise<string> {
    const fileExt = file.name.toLowerCase().split('.').pop();

    if (fileExt === 'txt') {
      return this.readTextFile(file);
    } else if (fileExt === 'zip') {
      return this.extractFromZip(file);
    } else {
      throw new Error('Formato no válido. Usa .txt o .zip de WhatsApp');
    }
  }

  private readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (!content || content.trim().length === 0) {
          reject(new Error('El archivo está vacío'));
        } else {
          resolve(content);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  }

  private async extractFromZip(file: File): Promise<string> {
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      // Buscar archivo .txt en el ZIP
      const txtFiles = Object.keys(zipContent.files).filter((filename) =>
        filename.toLowerCase().endsWith('.txt')
      );

      if (txtFiles.length === 0) {
        throw new Error('No se encontró archivo .txt en el ZIP');
      }

      // Usar el primer archivo .txt encontrado
      const txtFile = zipContent.files[txtFiles[0]];
      const content = await txtFile.async('text');

      if (!content || content.trim().length === 0) {
        throw new Error('El archivo extraído está vacío');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al procesar ZIP: ${error.message}`);
      }
      throw new Error('Error desconocido al procesar ZIP');
    }
  }

  async analizar() {
    if (!this.conversacion.trim()) {
      this.errorMsg.set('Pega o carga una conversación antes de analizar.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    console.log('📝 Iniciando análisis de conversación...');
    console.log('📤 Conversación enviada:', this.conversacion.substring(0, 300) + '...');

    const resultado = await this.analizarSvc.analizar(this.conversacion);

    this.loading.set(false);

    if (!resultado) {
      console.error('❌ Error: resultado vacío o nulo');
      this.errorMsg.set('Error al analizar la conversación. Verifica la configuración de Supabase.');
      return;
    }

    console.log('✅ Análisis completado. Resultado:', resultado);

    try {
      sessionStorage.setItem('itdux_analysis', JSON.stringify(resultado));
      sessionStorage.setItem('itdux_conversacion', this.conversacion);
      console.log('💾 Datos guardados en sessionStorage');
    } catch (err) {
      console.error('❌ Error guardando en sessionStorage:', err);
      this.errorMsg.set('Error al guardar el análisis. Intenta nuevamente.');
      return;
    }

    console.log('🚀 Navegando a /resultado-ia...');
    this.router.navigate(['/resultado-ia']);
  }
}
