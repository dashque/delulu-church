import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { NgTemplateOutlet } from '@angular/common';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';

@Component({
  selector: 'ngKitty-profile',
  imports: [TuiCardLarge, TuiAvatar, TuiIcon, TranslocoPipe, NgTemplateOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  protected readonly userProfileService = inject(UserProfileService);

  protected stats = [
    {
      value: 0,
      name: 'profile.confessions',
    },
    {
      value: 0,
      name: 'profile.writings',
    },
    {
      value: 0.0,
      name: 'profile.level',
    },
    {
      value: 0,
      name: 'profile.activity',
    },
  ];

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
