import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement }    from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { DataService } from './data-service/data.service'

class MockDataService {
}

let fixture: ComponentFixture<AppComponent>;
let de: DebugElement;
let el: HTMLElement;

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [{ provide: DataService, useClass: MockDataService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    const appComponent = fixture.debugElement.componentInstance;
    expect(appComponent).toBeTruthy();
  });

  it('shows the header and buttons', () => {
    fixture.detectChanges();
    expect(el.querySelector('h1').textContent).toContain('Welke gemeenten doen mee?');
    expect(el.querySelector('a').getAttribute('href')).toContain('https://frontendjr.nl');
    expect(el.querySelectorAll('button').length).toEqual(5);
  });
});
