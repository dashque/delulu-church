import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { TarotRole } from '@features/main/data/api/models/role.model';
import { TarotIntent } from '@features/main/data/api/models/intent.model';
import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import { TAROT_URL } from '@features/main/data/api/tokens/tarot-url.token';

@Service({
  autoProvided: false,
})
export class TarotService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = inject(TAROT_URL);
  public readonly role = signal<TarotRole>(TarotRole.DEVOPS);
  public readonly intent = signal<TarotIntent>(TarotIntent.FULL_RELEASE);

  public loadReading(role = this.role(), intent = this.intent()): Observable<TarotResponseApi> {
    return this.httpClient.get<TarotResponseApi>(this.url, {
      params: { role, intent },
    });
  }
}
