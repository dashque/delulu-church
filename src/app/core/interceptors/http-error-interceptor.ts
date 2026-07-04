import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { HotToastService } from '@ngxpert/hot-toast';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(HotToastService);
  const translocoService = inject(TranslocoService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (request.url.includes('/i18n/')) {
        return throwError(() => error);
      }

      notificationService.error(`${translocoService.translate(marker('http_error_label'))}
      ${toErrorMessage(error)}`);

      return throwError(() => error);
    })
  );
};
