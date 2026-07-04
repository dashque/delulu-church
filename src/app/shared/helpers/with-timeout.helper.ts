export const withTimeout = <T>(promise: Promise<T>, ms: number, message = 'Request timed out'): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(message)), ms);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
