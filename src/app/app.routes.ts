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
import { AltarPageFacade } from '@features/altar/facades/altar-page.facade';
import { PreloadFor } from '@core/services/preloading-strategy/models/preload-for.model';
import { MainPageFacade } from '@features/main/facades/main-page.facade';
import { MyMemoryTranslationService } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service';
import { SanctumPageFacade } from '@features/sanctum/facades/sanctum-page.facade';
import { SanctumFormService } from '@features/sanctum/services/sanctum-form.service';
import { SanctumRitualService } from '@features/sanctum/services/sanctum-ritual.service';
import { SanctumSoundService } from '@features/sanctum/services/sanctum-sound.service';
import { PriestQuotesService } from '@features/sanctum/services/priest-quotes.service';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MainComponent,
        providers: [provideTranslocoScope('main'), MainPageFacade, TarotService, MyMemoryTranslationService],
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
        providers: [provideTranslocoScope('altar'), AltarPageFacade],
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'sanctum',
        canMatch: [authGuard],
        loadComponent: () => import('./features/sanctum/ui/sanctum.component').then((c) => c.SanctumComponent),
        providers: [
          provideTranslocoScope('sanctum'),
          SanctumPageFacade,
          SanctumFormService,
          SanctumRitualService,
          SanctumSoundService,
          PriestQuotesService,
        ],
        data: { preloadFor: PreloadFor.AUTH },
      },
      {
        path: 'crystal-ball',
        loadComponent: () => import('./features/ball/ui/ball.component').then((c) => c.BallComponent),
        providers: [provideTranslocoScope('ball')],
        data: { preloadFor: PreloadFor.GUEST },
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent),
        providers: [provideTranslocoScope('not-found')],
      },
    ],
  },
];
