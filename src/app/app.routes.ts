import type { Routes } from '@angular/router';
import { LayoutComponent } from '@core/ui/components/layout/layout.component';
import { provideTranslocoScope } from '@jsverse/transloco';
import { RegisterPageFacade } from '@features/registration/facades/register-page.facade';
import { LoginPageFacade } from '@features/login/facades/login-page.facade';
import { authGuard } from '@core/guards/auth-guard';
import { dirtyFormGuard } from '@core/guards/dirty-form.guard';
import { guestGuard } from '@core/guards/guest-guard';
import { MainComponent } from '@features/main/ui/main.component';
import { TarotService } from '@features/main/data/api/services/tarot/tarot.service';
import { ShriftPageFacade } from '@features/shrift/facades/shrift-page.facade';
import { ConfessFormService } from '@features/shrift/services/confess-form.service';
import { PreloadFor } from '@core/services/preloading-strategy/models/preload-for.model';
import { MainPageFacade } from '@features/main/facades/main-page.facade';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MainComponent,
        providers: [provideTranslocoScope('main'), MainPageFacade, TarotService],
      },
      {
        path: 'profile',
        canMatch: [authGuard],
        loadComponent: () => import('./features/profile/profile.component').then((c) => c.ProfileComponent),
        providers: [provideTranslocoScope('profile')],
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'login',
        canMatch: [guestGuard],
        loadComponent: () => import('./features/login/ui/login.component').then((c) => c.LoginComponent),
        providers: [provideTranslocoScope('login'), LoginPageFacade],
        canDeactivate: [dirtyFormGuard],
        data: { preloadFor: PreloadFor.GUEST },
      },
      {
        path: 'register',
        canMatch: [guestGuard],
        loadComponent: () =>
          import('@features/registration/ui/register-page/register-page.component').then(
            (c) => c.RegisterPageComponent
          ),
        providers: [provideTranslocoScope('register'), RegisterPageFacade],
        canDeactivate: [dirtyFormGuard],
        data: { preloadFor: PreloadFor.GUEST },
      },
      {
        path: 'shrift',
        canMatch: [authGuard],
        loadComponent: () => import('./features/shrift/ui/shrift.component').then((c) => c.ShriftComponent),
        providers: [provideTranslocoScope('shrift'), ShriftPageFacade, ConfessFormService],
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'altar',
        canMatch: [authGuard],
        loadComponent: () => import('./features/altar/ui/altar.component').then((c) => c.AltarComponent),
        providers: [provideTranslocoScope('altar')],
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent),
        providers: [provideTranslocoScope('not-found')],
      },
    ],
  },
];
