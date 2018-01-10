import { Throttler } from './throttler'

describe('throttler', () => {

  let throttler: Throttler;
  let event: any = undefined;
  const functionToExecute = jasmine.createSpy('functionToExecute');

  beforeEach(() => {
    throttler = new Throttler();
  });

  it('makes zoom events trigger only every 125ms', (done) => {
    throttler.throttle(functionToExecute, event);
    throttler.throttle(functionToExecute, event);
    throttler.throttle(functionToExecute, event);
    setTimeout(() => {
      expect(functionToExecute).toHaveBeenCalledTimes(1);
      done();
    }, 150);

  });
});
