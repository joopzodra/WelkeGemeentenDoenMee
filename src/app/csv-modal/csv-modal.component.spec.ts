import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser'

import { CsvModalComponent } from './csv-modal.component';
import { DataService } from '../data-service/data.service'
import { FeatureCollection, MunicipalityData } from '../models/models'
import { stubMunicipalityData } from '../testing/stub-municipality-data'
import { stubFeatures } from '../testing/stub-feature-collection'

class MockDataService {
  municipalityData = stubMunicipalityData;
}

describe('CsvModalComponent', () => {
  let component: CsvModalComponent;
  let fixture: ComponentFixture<CsvModalComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsvModalComponent],
      providers: [{ provide: DataService, useClass: MockDataService }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvModalComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.autoDetectChanges(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing the download results in an alert in the browser, therefore no further test

});