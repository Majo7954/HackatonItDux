import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ImportChat } from './pages/import-chat/import-chat';
import { AiResult } from './pages/ai-result/ai-result';
import { FollowUps } from './pages/follow-ups/follow-ups';
import { Insights } from './pages/insights/insights';

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
  },
  {
    path: 'importar',
    component: ImportChat,
  },
  {
    path: 'resultado-ia',
    component: AiResult,
  },
  {
    path: 'seguimientos',
    component: FollowUps,
  },
  {
    path: 'insights',
    component: Insights,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];