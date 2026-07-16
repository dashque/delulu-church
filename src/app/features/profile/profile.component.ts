import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiProgress } from '@taiga-ui/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { NgTemplateOutlet } from '@angular/common';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { ProfileFacade } from './facades/profile.facade';
import { ProfileFormComponent } from './ui/profile-form.component';
import { StatCardComponent } from './ui/stat-card/stat-card.component';

@Component({
  selector: 'ngKitty-profile',
  imports: [
    TuiCardLarge,
    TuiAvatar,
    TuiIcon,
    TuiProgress,
    TranslocoPipe,
    NgTemplateOutlet,
    ProfileFormComponent,
    StatCardComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  protected readonly facade = inject(ProfileFacade);

  protected readonly userProfileService = inject(UserProfileService);

  protected achieves = [
    {
      icon: './assets/pray.svg',
      width: 30,
      alt: 'pray',
      title: 'profile.achieve.first_confession.title',
      description: 'profile.achieve.first_confession.description',
    },
    {
      icon: './assets/beads.svg',
      width: 35,
      alt: 'beads',
      title: 'profile.achieve.penitent.title',
      description: 'profile.achieve.penitent.description',
    },
    {
      icon: './assets/candle.svg',
      width: 35,
      alt: 'candle',
      title: 'profile.achieve.first_candle.title',
      description: 'profile.achieve.first_candle.description',
    },
    {
      icon: './assets/flame.svg',
      width: 30,
      alt: 'flame',
      title: 'profile.achieve.flame_keeper.title',
      description: 'profile.achieve.flame_keeper.description',
    },
    {
      icon: './assets/oil.svg',
      width: 35,
      alt: 'lamp',
      title: 'profile.achieve.altar_master.title',
      description: 'profile.achieve.altar_master.description',
    },
    {
      icon: './assets/angel.svg',
      width: 35,
      alt: 'angel',
      title: 'profile.achieve.saved.title',
      description: 'profile.achieve.saved.description',
    },
    {
      icon: './assets/coins.svg',
      width: 35,
      alt: 'coins',
      title: 'profile.achieve.saint.title',
      description: 'profile.achieve.saint.description',
    },
  ];
}
