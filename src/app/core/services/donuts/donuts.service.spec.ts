import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { DonutService } from './donuts.service';
import { DONUTS_MOCK } from './donuts.service.mock';
import { createEmptyDonutCounts } from '@core/services/donuts/models/donut-count.model';

describe('DonutService', () => {
  let service: DonutService;

  beforeEach(() => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [DonutService],
    });

    service = TestBed.inject(DonutService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  it('должен загрузить значения из DONUTS_MOCK при создании', () => {
    expect(service.donutCounts()).toEqual(DONUTS_MOCK);
  });

  it('должен вернуть общее количество донатов', () => {
    expect(service.totalDonuts()).toBe(1);
  });

  it('должен обновить количество донатов', () => {
    service.setDonutCounts({
      sacrifice: 10,
    });

    expect(service.donutCounts()).toEqual({
      sacrifice: 10,
    });

    expect(service.totalDonuts()).toBe(10);
  });

  it('должен сбросить количество донатов', () => {
    service.setDonutCounts({
      sacrifice: 5,
    });

    service.reset();

    expect(service.donutCounts()).toEqual(createEmptyDonutCounts());
    expect(service.totalDonuts()).toBe(0);
  });
});
