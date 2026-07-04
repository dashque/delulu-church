import { HttpErrorResponse } from '@angular/common/http';

export const toErrorMessage = (error: unknown) => {
  if (error instanceof HttpErrorResponse) {
    return (error.error?.message as string) ?? (error.message as string);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};
