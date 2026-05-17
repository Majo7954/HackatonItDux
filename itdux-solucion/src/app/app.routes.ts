import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ImportChat } from './pages/import-chat/import-chat';
import { AiResult } from './pages/ai-result/ai-result';
import { FollowUps } from './pages/follow-ups/follow-ups';
import { Insights } from './pages/insights/insights';
import { ProspectProfile } from './pages/prospect-profile/prospect-profile';
import { authGuard } from './core/guards/auth.guard';
import { analysisResultGuard } from './core/guards/analysis-result.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'importar',
    component: ImportChat,
    canActivate: [authGuard],
  },
  {
    path: 'resultado-ia',
    component: AiResult,
    canActivate: [authGuard, analysisResultGuard],
  },
  {
    path: 'seguimientos',
    component: FollowUps,
    canActivate: [authGuard],
  },
  {
    path: 'prospect-profile/:id',
    component: ProspectProfile,
    canActivate: [authGuard],
  },
  {
    path: 'insights',
    component: Insights,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
