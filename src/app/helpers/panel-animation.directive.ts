import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Adds a little animation when showing and hiding an html element.
 */

@Directive({
  selector: '[jrPanelAnimation]',
  exportAs: 'panelAnimation'
})
export class PanelAnimationDirective {

  private elementVisible = false;
  private PANEL_ANIMATION_DELAY = 10; /*ms*/
  private PANEL_ANIMATION_STEPS = 10;
  private el: HTMLElement
  public showElementButton = true;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.el.style.display = 'none';
    this.el.style.overflow = 'hidden';
  }

  toggleElement() {
    if (this.elementVisible === false) {
      this.elementVisible = true;
      this.animateToggle(1);
      this.showElementButton = false;
    } else {
      this.animateToggle(-1);
      this.elementVisible = false;
    }
  }

  animateToggle(direction: 1 | -1) {
    this.el.style.display = 'block';
    const contentHeight = this.el.offsetHeight;
    if (direction === 1) {
      this.el.style.height = '0px';
    }
    const stepHeight = contentHeight / this.PANEL_ANIMATION_STEPS;
    setTimeout(() => {
      this.animateStep(1, stepHeight, direction);
    }, this.PANEL_ANIMATION_DELAY);
  }

  animateStep(iteration: number, stepHeight: number, direction: 1 | -1) {
    const el = this.elementRef.nativeElement;
    if (iteration < this.PANEL_ANIMATION_STEPS) {
      el.style.height = Math.round(((direction > 0) ? iteration : this.PANEL_ANIMATION_STEPS - iteration) * stepHeight) + "px";
      iteration++;
      setTimeout(() => {
        this.animateStep(iteration, stepHeight, direction);
      }, this.PANEL_ANIMATION_DELAY);
    } else {
      el.style.display = (direction === -1) ? 'none' : 'block';
      el.style.height = '';
      if (direction === -1) {
        this.showElementButton = true;
      }
    }
  }

}
