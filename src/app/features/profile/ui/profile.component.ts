import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { ZodiacPipe } from './pipes/zodiac.pipe';
import { NewProfileFacade } from '@features/profile/facades/new-profile.facade';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { ProfileFormComponent } from '@features/profile/ui/profile-form/profile-form.component';
import { StatCardComponent } from '@features/profile/ui/stat-card/stat-card.component';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { DonutService } from '@features/profile/services/donut/donut.service';

@Component({
  selector: 'ngKitty-profile',
  imports: [TuiCardLarge, TuiAvatar, TuiIcon, TranslocoPipe, ProfileFormComponent, StatCardComponent, ZodiacPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [provideTranslocoScope('profile'), ProfileFacade, DonutService, NewProfileFacade, ProfileFormService],
})
export class ProfileComponent {
  protected readonly facade = inject(ProfileFacade);
  protected user = this.facade.profile;
  protected readonly achieves = this.facade.achievementInfo;
}
