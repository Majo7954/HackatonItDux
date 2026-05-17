import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../core/services/auth.service';
import { AdvisorService } from '../../core/services/advisor.service';
import type { Advisor } from '../../core/models/types';

@Component({
  selector: 'app-insights',
  imports: [RouterLink, Sidebar],
  templateUrl: './insights.html',
  styleUrl: './insights.scss',
})
export class Insights implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly advisorSvc = inject(AdvisorService);

  advisor = signal<Advisor | null>(null);

  async ngOnInit() {
    const user = await this.auth.getUser();
    if (!user) return;
    const advisorData = await this.advisorSvc.getAdvisor(user.id);
    this.advisor.set(advisorData);
  }

  initials(nombre: string) {
    return nombre
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
