import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { NgTemplateOutlet } from '@angular/common';
import { ProfileFacade } from './facades/profile.facade';
import { ProfileFormComponent } from './ui/profile-form.component';
import { StatCardComponent } from './ui/stat-card/stat-card.component';

@Component({
  selector: 'ngKitty-profile',
  imports: [TuiCardLarge, TuiAvatar, TuiIcon, TranslocoPipe, NgTemplateOutlet, ProfileFormComponent, StatCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [provideTranslocoScope('profile'), ProfileFacade],
})
export class ProfileComponent {
  protected readonly facade = inject(ProfileFacade);
  protected user = this.facade.profile;
  protected achieves = [
    {
      icon: './assets/pray.svg',
      width: 30,
      alt: 'pray',
      title: 'profile.achieve.first_confession.title',
      description: 'profile.achieve.first_confession.description',
    },
    {
      icon: './assets/open-book-svgrepo-com.svg',
      width: 35,
      alt: 'book',
      title: 'profile.achieve.chronicist.title',
      description: 'profile.achieve.chronicist.description',
    },
    {
      icon: './assets/happy.svg',
      width: 30,
      alt: 'smile',
      title: 'profile.achieve.good_mood.title',
      description: 'profile.achieve.good_mood.description',
    },
    {
      icon: './assets/star.svg',
      width: 35,
      alt: 'star',
      title: 'profile.achieve.regular_visitor.title',
      description: 'profile.achieve.regular_visitor.description',
    },
    {
      icon: './assets/crystal-ball.svg',
      width: 35,
      alt: 'magic ball',
      title: 'profile.achieve.penitent.title',
      description: 'profile.achieve.penitent.description',
    },
  ];
}
