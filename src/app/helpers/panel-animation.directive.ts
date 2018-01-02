import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Adds a little animation when showing and hiding an html element.
 */

@Directive({
  selector: '[jrPanelAnimation]',
  exportAs: 'panelAnimation'
})
export class PanelAnimationDirective {

  visible = false;
  showElementButton = true;
  PANEL_ANIMATION_DELAY = 10; /*ms*/
  PANEL_ANIMATION_STEPS = 10;

  constructor(private elementRef: ElementRef) {
    const el = this.elementRef.nativeElement;
    el.style.display = 'none';
    el.style.overflow = 'hidden';
  }

  toggleElement() {
    if (this.visible === false) {
      this.visible = true;
      this.animateToggle(1);
      this.showElementButton = false;
    } else {
      this.animateToggle(-1);
      this.visible = false;
    }
  }

  animateToggle(direction: 1 | -1) {
    const el = this.elementRef.nativeElement;
    el.style.display = 'block';
    const contentHeight = el.offsetHeight;
    if (direction === 1) {
      el.style.height = '0px';
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
