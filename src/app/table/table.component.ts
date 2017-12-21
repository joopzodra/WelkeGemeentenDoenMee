import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms'
import * as d3 from 'd3'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'

import { DataService } from '../data-service/data.service'
import { FeatureCollection, Feature, MunicipalityData } from '../models/models'
import { translate } from '../helpers/translate'


@Component({
  selector: 'jr-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  queriedData$: Observable<MunicipalityData[]>;
  dataErr$: BehaviorSubject<boolean>;
  @ViewChild(NgForm) form: NgForm;
  modalDisplay = false;
  municData: MunicipalityData;
  translate = translate;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    const data$ = this.dataService.municipalityData$;
    const formStream$ = this.form.valueChanges;
    this.queriedData$ = Observable.combineLatest(data$, formStream$)
      .map(([data, formValue]) => {
        const regex = new RegExp(formValue.query, 'i');
        data = data.filter(d => regex.test(d.MUN_NAME));
        if (!(formValue.yes || formValue.maybe || formValue.no || formValue.unknown)) {
          return data;
        }
        let dataYes: MunicipalityData[] = [];
        let dataMaybe: MunicipalityData[] = [];
        let dataNo: MunicipalityData[] = [];
        let dataUnknown: MunicipalityData[] = [];
        let dataConcat: MunicipalityData[] = [];
        if (formValue.yes) {
          dataYes = data.filter(d => d.ISIN === translate('yes'));
        }
        if (formValue.maybe) {
          dataMaybe = data.filter(d => d.ISIN === translate('maybe'));
        }
        if (formValue.no) {
          dataNo = data.filter(d => d.ISIN === translate('no'));
        }
        if (formValue.unknowm) {
          dataUnknown = data.filter(d => d.ISIN === translate('unknown'));
        }
        return dataConcat.concat(dataYes, dataMaybe, dataNo, dataUnknown);
      });
    this.dataErr$ = this.dataService.dataErr$;
  }

  clearSearch() {
    const formValue = this.form.value;
    formValue.query = '';
    this.form.setValue(formValue);
  }

  clearFilter() {
    const query = this.form.value.query;
    this.form.setValue({query: query, yes: '', maybe: '', no: '', unknown: ''});
  }

  showDialogModal(row: MunicipalityData) {
    this.municData = row;
    this.modalDisplay = true;
  }

  hideDialogModal(event: boolean) {
    this.modalDisplay = false;
  }

  reload() {
    window.location.reload();
  }

}
