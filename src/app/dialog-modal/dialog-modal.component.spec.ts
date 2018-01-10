import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser'

import { DialogModalComponent } from './dialog-modal.component';
import { DataService } from '../data-service/data.service'
import { MunicipalityData } from '../models/models'
import { stubMunicipalityData } from '../testing/stub-municipality-data'
import { stubFeatures } from '../testing/stub-feature-collection'

class MockDataService {
}

@Component({
  template: "<jr-dialog-modal *ngIf='modalDisplay' [municData]='municData' (hideModal)='hideDialogModal($event)'></jr-dialog-modal>"
})
class TestHostComponent {
  modalDisplay = true;
  municData: MunicipalityData = stubMunicipalityData[0];
  hideDialogModal(event: boolean) {
    this.modalDisplay = false;
  }
}

describe('DialogModalComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComp: TestHostComponent;
  let testHostDe: DebugElement;
  let testHostEl: HTMLElement;
  let dialogModalDe: DebugElement;
  let dialogModal: DialogModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DialogModalComponent, TestHostComponent],
      providers: [{ provide: DataService, useClass: MockDataService }],
    });
  });

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComp = testHostFixture.componentInstance;
    testHostDe = testHostFixture.debugElement;
    testHostEl = testHostDe.nativeElement;
    testHostFixture.detectChanges();
    dialogModalDe = testHostDe.query(By.css('jr-dialog-modal'));
    dialogModal = dialogModalDe.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(dialogModal).toBeTruthy();
  });

  it('shows the data received from its host component', () => {
    expect(dialogModalDe.query(By.css('h2')).nativeElement.textContent).toBe('Appingedam');
    expect(dialogModal.municData.ISIN).toBe('maybe'); //reflects via ngModel the value of the radio buttons 
  });

  it('its template is hidden when expected', () => {
    dialogModalDe.triggerEventHandler('hideModal', true);
    testHostFixture.detectChanges();
    expect(testHostComp.modalDisplay).toBeFalsy();
  });

});