import { ZodiacPipe } from './zodiac.pipe';
import { ZODIACS } from '@features/profile/data/constants/zodiac.constants';

describe('ZodiacPipe', () => {
  let pipe: ZodiacPipe;

  beforeEach(() => {
    pipe = new ZodiacPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return Aries for April 1', () => {
    expect(pipe.transform('2000-04-01')).toEqual(ZODIACS.aries);
  });

  it('should return Taurus for May 1', () => {
    expect(pipe.transform('2000-05-01')).toEqual(ZODIACS.taurus);
  });

  it('should return Gemini for June 1', () => {
    expect(pipe.transform('2000-06-01')).toEqual(ZODIACS.gemini);
  });

  it('should return Cancer for July 1', () => {
    expect(pipe.transform('2000-07-01')).toEqual(ZODIACS.cancer);
  });

  it('should return Leo for August 1', () => {
    expect(pipe.transform('2000-08-01')).toEqual(ZODIACS.leo);
  });

  it('should return Virgo for September 1', () => {
    expect(pipe.transform('2000-09-01')).toEqual(ZODIACS.virgo);
  });

  it('should return Libra for October 1', () => {
    expect(pipe.transform('2000-10-01')).toEqual(ZODIACS.libra);
  });

  it('should return Scorpio for November 1', () => {
    expect(pipe.transform('2000-11-01')).toEqual(ZODIACS.scorpio);
  });

  it('should return Sagittarius for December 1', () => {
    expect(pipe.transform('2000-12-01')).toEqual(ZODIACS.sagittarius);
  });

  it('should return Capricorn for January 1', () => {
    expect(pipe.transform('2000-01-01')).toEqual(ZODIACS.capricorn);
  });

  it('should return Aquarius for February 1', () => {
    expect(pipe.transform('2000-02-01')).toEqual(ZODIACS.aquarius);
  });

  it('should return Pisces for March 1', () => {
    expect(pipe.transform('2000-03-01')).toEqual(ZODIACS.pisces);
  });

  it('should return unknown when date is null', () => {
    expect(pipe.transform(null)).toEqual(ZODIACS.unknown);
  });

  it('should return unknown when date is undefined', () => {
    expect(pipe.transform(undefined)).toEqual(ZODIACS.unknown);
  });
});
