import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type SidebarPath = 'dashboard' | 'importar' | 'seguimientos' | 'insights' | 'resultado-ia' | 'prospect-profile';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() activePath: SidebarPath | '' = '';

  private readonly auth = inject(AuthService);

  get showResultLink(): boolean {
    return this.activePath === 'resultado-ia';
  }

  async logout(): Promise<void> {
    await this.auth.logout();
  }
}
