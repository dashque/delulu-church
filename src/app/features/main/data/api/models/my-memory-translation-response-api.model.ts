export interface MyMemoryTranslationResponseApi {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseDetails: string;
  responseStatus: number;
}
