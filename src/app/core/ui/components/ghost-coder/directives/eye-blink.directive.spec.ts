import { EyeBlinkDirective } from './eye-blink.directive';

describe('EyeBlinkDirective', () => {
  it('должен инициализироваться', () => {
    const directive = new EyeBlinkDirective();

    expect(directive).toBeTruthy();
  });
});
