import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core';
import { catchError, throwError } from 'rxjs';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(TuiNotificationService);
  const translocoService = inject(TranslocoService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (request.url.includes('/i18n/')) {
        return throwError(() => error);
      }

      const errorMessage = toErrorMessage(error);

      notificationService
        .open(errorMessage, {
          label: translocoService.translate(marker('http_error_label')),
          appearance: 'negative',
          autoClose: 5000,
        })
        .subscribe();

      return throwError(() => error);
    })
  );
};
