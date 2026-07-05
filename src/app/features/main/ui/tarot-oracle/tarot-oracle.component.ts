import { Component, input, model, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TarotRole } from '@features/main/data/api/models/role.model';
import { TarotIntent } from '@features/main/data/api/models/intent.model';
import { TuiChevron, TuiDataListWrapper, TuiSelectDirective } from '@taiga-ui/kit';
import { enumToArray } from '@shared/helpers/enum-to-array.helper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngKitty-tarot-oracle',
  imports: [
    TranslocoPipe,
    TuiButton,
    TuiTextfield,
    TuiChevron,
    TuiSelectDirective,
    TuiDataListWrapper,
    FormsModule,
    TuiIcon,
  ],
  templateUrl: './tarot-oracle.component.html',
  styleUrl: './tarot-oracle.component.scss',
})
export class TarotOracleComponent {
  public readonly isLoading = input.required<boolean>();
  public readonly role = model.required<TarotRole>();
  public readonly intent = model.required<TarotIntent>();
  public readonly drawCardsClicked = output<void>();
  protected readonly TarotIntent = enumToArray(TarotIntent);
  protected readonly TarotRole = enumToArray(TarotRole);
}
