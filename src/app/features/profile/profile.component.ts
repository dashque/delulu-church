import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { ProfileFacade } from './facades/profile.facade';
import { ProfileFormComponent } from './ui/profile-form.component';
import { StatCardComponent } from './ui/stat-card/stat-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'ngKitty-profile',
  imports: [TuiCardLarge, TuiAvatar, TuiIcon, TuiProgress, TranslocoPipe, ProfileFormComponent, StatCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [provideTranslocoScope('profile'), ProfileFacade],
})
export class ProfileComponent {
  protected readonly facade = inject(ProfileFacade);
  protected user = this.facade.profile;
  protected readonly achieves = this.facade.achievementInfo;
}
