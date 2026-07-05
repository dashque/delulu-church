import { TuiRoot } from '@taiga-ui/core';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { uiStateStore } from '@core/store/ui-state.store';

@Component({
  selector: 'ngKitty-app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public readonly theme = inject(uiStateStore).theme;
}
