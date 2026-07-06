import { TuiRoot } from '@taiga-ui/core';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { uiStateStore } from '@core/store/ui-state.store';
import { ScanEffectDirective } from '@shared/directives/scan-effect/scan-effect.directive';

@Component({
  selector: 'ngKitty-app-root',
  imports: [RouterOutlet, ScanEffectDirective, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public readonly theme = inject(uiStateStore).theme;
}
