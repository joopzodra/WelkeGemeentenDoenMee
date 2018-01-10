import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { NO_ERRORS_SCHEMA, DebugElement, Directive } from '@angular/core';
import { By } from '@angular/platform-browser'

import { TableComponent } from './table.component';
import { DataService } from '../data-service/data.service'
import { FeatureCollection, MunicipalityData } from '../models/models'
import { stubFeatures } from '../testing/stub-feature-collection'
import { stubMunicipalityData } from '../testing/stub-municipality-data'

class MockDataService {
  featureCollection$ = new BehaviorSubject<FeatureCollection>(stubFeatures);
  municipalityData$ = new BehaviorSubject<MunicipalityData[]>(stubMunicipalityData);
  //dataErr$ = new BehaviorSubject<boolean>(false);
  getData() { };
}

@Directive({
  selector: '[jrPanelAnimation]',
  exportAs: 'panelAnimation'
})
class stubPanelAnimationDirective { }

let formValue: { query: string, yes: boolean, maybe: boolean, no: boolean, unknown: boolean };

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TableComponent, stubPanelAnimationDirective],
      providers: [{ provide: DataService, useClass: MockDataService }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.autoDetectChanges(true);
    formValue = { query: '', yes: false, maybe: false, no: false, unknown: false };
    fixture.detectChanges();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it('shows a table with a row for every municipality', async(() => {
    expect(de.query(By.css('table'))).toBeTruthy();
    fixture.whenStable().then(() => {
      component.form.setValue(formValue);
      fixture.detectChanges();
      expect(de.queryAll(By.css('tr')).length).toBe(3);
    });
  }));

  it('the table rows have the expected cells and cell content', async(() => {
    fixture.whenStable().then(() => {
      component.form.setValue(formValue);
      fixture.detectChanges();
      const cells = de.query(By.css('tr')).queryAll(By.css('td'));
      expect(cells[0].nativeElement.textContent).toBe('Appingedam');
      expect(cells[1].query(By.css('span')).nativeElement.className).toBe('square maybe');
      expect(cells[2].nativeElement.textContent).toBe('belangstelling');
    });
  }));

  it('filters the content by search query', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      formValue.query = 'Be';
      component.form.setValue(formValue);
      fixture.detectChanges();
      expect(de.queryAll(By.css('tr')).length).toBe(2);
      formValue.query = 'Bel';
      component.form.setValue(formValue);
      fixture.detectChanges();
      expect(de.queryAll(By.css('tr')).length).toBe(1);
    });
  }));

  it('filters the content by ISIN', async(() => {
    formValue.no = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.form.setValue(formValue);
      fixture.detectChanges();
      expect(de.queryAll(By.css('tr')).length).toBe(1);
      expect(de.query(By.css('td')).nativeElement.textContent).toBe('Bellingwedde');
    });
  }));

  it('shows the dialog-modal after clicking a row', async(() => {
    fixture.whenStable().then(() => {
      component.form.setValue(formValue);
      fixture.detectChanges();
      de.query(By.css('tr')).triggerEventHandler('click', null); // get the first row
      expect(component.municData).toBe(stubMunicipalityData[0]); // expect the first element of the data array
      expect(component.modalDisplay).toBe(true);
    });
  }));

});
