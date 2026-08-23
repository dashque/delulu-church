import type { Routes } from '@angular/router';
import { LayoutComponent } from '@core/ui/components/layout/layout.component';
import { authGuard } from '@core/guards/auth-guard';
import { dirtyFormGuard } from '@core/guards/dirty-form.guard';
import { guestGuard } from '@core/guards/guest-guard';
import { MainComponent } from '@features/main/ui/main.component';
import { PreloadFor } from '@core/services/preloading-strategy/models/preload-for.model';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MainComponent,
      },
      {
        path: 'profile',
        canMatch: [authGuard],
        canDeactivate: [dirtyFormGuard],
        loadComponent: () => import('@features/profile/ui/profile.component').then((c) => c.ProfileComponent),
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'login',
        canMatch: [guestGuard],
        canDeactivate: [dirtyFormGuard],
        loadComponent: () => import('@features/login/ui/login.component').then((c) => c.LoginComponent),
        data: { preloadFor: PreloadFor.GUEST },
      },
      {
        path: 'register',
        canMatch: [guestGuard],
        canDeactivate: [dirtyFormGuard],
        loadComponent: () =>
          import('@features/registration/ui/register-page/register-page.component').then(
            (c) => c.RegisterPageComponent
          ),
        data: { preloadFor: PreloadFor.GUEST },
      },
      {
        path: 'shrift',
        canMatch: [authGuard],
        canDeactivate: [dirtyFormGuard],
        loadComponent: () => import('./features/shrift/ui/shrift.component').then((c) => c.ShriftComponent),
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'altar',
        canMatch: [authGuard],
        loadComponent: () => import('./features/altar/ui/altar.component').then((c) => c.AltarComponent),
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'sanctum',
        canMatch: [authGuard],
        loadComponent: () => import('./features/sanctum/ui/sanctum.component').then((c) => c.SanctumComponent),
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'crystal-ball',
        loadComponent: () => import('./features/ball/ui/ball.component').then((c) => c.BallComponent),
        data: { preloadFor: PreloadFor.GUEST },
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent),
      },
    ],
  },
];
