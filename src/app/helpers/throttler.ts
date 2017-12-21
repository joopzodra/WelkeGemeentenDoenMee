import * as d3 from 'd3'

export const throttler = (functionToExecute: any, d3Event: any) => {
  //zoomTimeout is undefined when a new resize event can be handled. During the handling of a zoom event, it is defined.
  let zoomTimeout: undefined | any;
  return (() => {
    // ignore zoom events as long as an functionToExecute is in the queue
    if (!zoomTimeout) {
      zoomTimeout = d3.timeout(() => {
        zoomTimeout = undefined;
        functionToExecute(d3Event);
        // functionToExecute will execute at a rate of 1000 / 62 = 16fps
      }, 62);
    }
  })();
}