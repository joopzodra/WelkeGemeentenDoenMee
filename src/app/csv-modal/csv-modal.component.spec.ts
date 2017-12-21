import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvModalComponent } from './csv-modal.component';

describe('CsvModalComponent', () => {
  let component: CsvModalComponent;
  let fixture: ComponentFixture<CsvModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
