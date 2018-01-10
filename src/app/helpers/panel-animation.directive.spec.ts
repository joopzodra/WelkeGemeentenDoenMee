import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser'

import { PanelAnimationDirective } from './panel-animation.directive';


@Component({
  template: `
    <div #panelAnimation='panelAnimation' jrPanelAnimation><p>paragraph 1</p><p>paragraph 2</p><p>paragraph 3</p><p>paragraph 4</p></div>
    <button (click)='panelAnimation.toggleElement()'>&times;</button>
  `
})
class TestHostComponent {
}

describe('PanelAnimationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let comp: TestHostComponent;
  let de: DebugElement;
  let el: HTMLElement;

  let timerCallback;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, PanelAnimationDirective],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.autoDetectChanges(true);
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('animates the element\'s height from 0 to the maximum height', () => {
    const div = de.query(By.css('div')).nativeElement;
    const button = de.query(By.css('button'));
    div.style.display = 'block';
    const contentHeight = div.offsetHeight;
    div.style.display = 'none';
    const panelAnimationSteps = 10 // manually copy this value from the PanelAnimationDirective
    const panelAnimationDelay = 10;// manually copy this value from the PanelAnimationDirective  
    const heightStep = contentHeight / panelAnimationSteps;
    button.triggerEventHandler('click', null);
    expect(div.offsetHeight).toBe(0);
    setTimeout(() => {
      fixture.detectChanges();
      expect(div.offsetHeight).toBeGreaterThan(0);
      expect(div.offsetHeight).toBeLessThan(contentHeight / 2);
    }, 4 * panelAnimationDelay);
/*    setTimeout(() => {
      fixture.detectChanges();
      expect(div.offsetHeight).toBeCloseTo(5 * heightStep, 0); // example of using Jasmine matcher toBeCloseTo (note: it also accepts negative values for the decimal precision; default is 2; we use here 0). But not used because browser differ in the div's height, so we can't predict the div's height accurately.
    }, 6 * panelAnimationDelay)*/;
    setTimeout(() => {
      fixture.detectChanges();
      expect(div.offsetHeight).toBeGreaterThan(0);
      expect(div.offsetHeight).toBeLessThan(contentHeight);
    }, 8 * panelAnimationDelay);
    setTimeout(() => {
      fixture.detectChanges();
      expect(div.offsetHeight).toBe(contentHeight);
    }, 11 * panelAnimationDelay); // We take 15 instead of 10 times the panelAnimationDelay to be sure that the panel is at full height.
    jasmine.clock().tick(1101);
  });

});
