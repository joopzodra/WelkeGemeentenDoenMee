import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DebugElement } from '@angular/core';

import { MapComponent } from './map.component';
import { DataService } from '../data-service/data.service'
import { FeatureCollection, MunicipalityData } from '../models/models'
import { stubFeatures } from '../testing/stub-feature-collection'
import { stubMunicipalityData } from '../testing/stub-municipality-data'

class MockDataService {
  featureCollection$ = new BehaviorSubject<FeatureCollection>(stubFeatures);
  municipalityData$ = new BehaviorSubject<MunicipalityData[]>(stubMunicipalityData);
  dataErr$ = new BehaviorSubject<boolean>(false);
  getData() { };
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [{ provide: DataService, useClass: MockDataService }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has an svg element', () => {
    expect(el.querySelector('svg')).toBeTruthy();
  });

  it('the svg element shows the municipality path elements', () => {
    const pathes = Array.from(el.querySelectorAll('svg path'));
    expect(pathes.length).toBe(3);
    pathes.forEach(path => {
      const bBox = (<any>path).getBBox();
      expect(bBox.width).toBeGreaterThan(5);
      expect(bBox.height).toBeGreaterThan(5);
    });
  });

  it('the path elements have the correct css-class for the color', () => {
    const pathes = el.querySelectorAll('svg path');
    expect(pathes[0].getAttribute('class')).toBe('maybe');
    expect(pathes[1].getAttribute('class')).toBe('maybe');
    expect(pathes[2].getAttribute('class')).toBe('no');
  });

});
