import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'importar',
    renderMode: RenderMode.Client,
  },
  {
    path: 'resultado-ia',
    renderMode: RenderMode.Client,
  },
  {
    path: 'seguimientos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'insights',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
