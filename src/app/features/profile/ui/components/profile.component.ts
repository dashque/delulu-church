import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { NewProfileFacade } from '@features/profile/facades/new-profile.facade';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { DonutService } from '@features/profile/services/donut/donut.service';
import { ProfileFormComponent } from '@features/profile/ui/components/profile-form/profile-form.component';
import { StatCardComponent } from '@features/profile/ui/components/stat-card/stat-card.component';
import { ZodiacPipe } from '@features/profile/ui/pipes/zodiac.pipe';

@Component({
  selector: 'ngKitty-profile',
  imports: [TuiCardLarge, TuiAvatar, TuiIcon, TranslocoPipe, ProfileFormComponent, StatCardComponent, ZodiacPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [provideTranslocoScope('profile'), ProfileFacade, DonutService, NewProfileFacade, ProfileFormService],
})
export class ProfileComponent {
  protected readonly profileFacade = inject(ProfileFacade);
  protected readonly user = this.profileFacade.profile;
  protected readonly statCards = this.profileFacade.statCards;
  protected readonly achievementProgress = this.profileFacade.achievementProgress;
  protected readonly achievementInfo = this.profileFacade.achievementInfo;
  protected readonly isLoading = this.profileFacade.isLoading;
  protected readonly form = this.profileFacade.profileForm;
  protected readonly achieves = this.profileFacade.achievementInfo;

  protected onSubmit() {
    void this.profileFacade.submit();
  }
}
