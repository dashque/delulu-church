import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { afterNextRender, Component, inject } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FooterComponent } from '@core/ui/components/layout/footer/footer.component';
import { SidebarComponent } from '@core/ui/components/layout/sidebar/sidebar.component';
import { LayoutService } from '@core/services/layout/layout.service';
import { HeaderComponent } from '@core/ui/components/layout/header/header.component';
import { TuiMainComponent } from '@taiga-ui/layout';
import { TuiAvatar, TuiTooltip } from '@taiga-ui/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { NAVIGATION_ITEM_LIST } from '@core/ui/components/layout/constants/navigation-item-list.config';
import { GhostCoderComponent } from '../ghost-coder/ghost-coder.component';

@Component({
  selector: 'ngKitty-layout',
  imports: [
    RouterOutlet,
    FooterComponent,
    SidebarComponent,
    TuiButton,
    TuiIcon,
    HeaderComponent,
    TuiMainComponent,
    RouterLink,
    RouterLinkActive,
    TuiAvatar,
    TuiTooltip,
    TranslocoPipe,
    GhostCoderComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  protected readonly layoutService = inject(LayoutService);
  protected readonly isMobileNavOpen = this.layoutService.isMobileNavOpen;
  protected readonly user = this.layoutService.user;
  protected readonly navigationItemList = NAVIGATION_ITEM_LIST;
  protected readonly theme = this.layoutService.theme;
  protected readonly isSpiritPleased = this.layoutService.isSpiritPleased;

  constructor() {
    afterNextRender(() => {
      this.layoutService.watchMobileNavMediaQuery();
    });
  }

  public onCloseMobileNav() {
    this.layoutService.onCloseMobileNav();
  }

  public onToggleMobileNav() {
    this.layoutService.onToggleMobileNav();
  }

  public async onLogout() {
    await this.layoutService.logout();
  }

  public toggleTheme() {
    this.layoutService.toggleTheme();
  }
}
