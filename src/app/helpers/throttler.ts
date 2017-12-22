import { Injectable } from '@angular/core';
import * as d3 from 'd3'

@Injectable()
export class Throttler {

  //zoomTimeout is undefined when a new resize event can be handled. During the handling of a zoom event, it is defined.
  private zoomTimeout: undefined | any;

  public throttle(functionToExecute: any, d3Event: any) {
    // ignore zoom events as long as an functionToExecute is in the queue
    if (!this.zoomTimeout) {
      this.zoomTimeout = d3.timeout(() => {
        this.zoomTimeout = undefined;
        functionToExecute(d3Event);
        // functionToExecute will execute at a rate of 1000 / 62 = 16fps
      }, 125);      
    }    
  }
}