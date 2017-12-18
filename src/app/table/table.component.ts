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

  dataError = false;
  queriedData$: Observable<MunicipalityData[]>;
  dataErr$: BehaviorSubject<boolean>;
  @ViewChild(NgForm) form: NgForm;
  modalDisplay = false;
  municData: MunicipalityData;
  translate = translate;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    const data$ = this.dataService.municipalityData$;
    const formStream$ = this.form.valueChanges
      .map(formValue => formValue.query);
    this.queriedData$ = Observable.combineLatest(data$, formStream$)
      .map(([data, query]) => {
        const regex = new RegExp(query, 'i');
        return data.filter(d => regex.test(d.MUN_NAME));
      });
    this.dataErr$ = this.dataService.dataErr$;
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
