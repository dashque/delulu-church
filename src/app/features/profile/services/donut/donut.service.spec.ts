import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DonutService } from '../donut/donut.service';
import { INITIAL_DONUT_COUNTS } from './data/constants/donut-count.constants';

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

  it('должен загрузить значения из INITIAL_DONUT_COUNTS при создании', () => {
    expect(service.donutCounts()).toEqual(INITIAL_DONUT_COUNTS);
  });

  it('должен вернуть общее количество донатов', () => {
    expect(service.totalDonuts()).toBe(0);
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

    expect(service.totalDonuts()).toBe(0);
  });
});
