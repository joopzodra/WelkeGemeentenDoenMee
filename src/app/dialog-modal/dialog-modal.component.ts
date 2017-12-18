import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { DataService } from '../data-service/data.service'
import { MunicipalityData } from '../models/models'
import { translate } from '../helpers/translate'

@Component({
  selector: 'jr-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.scss']
})
export class DialogModalComponent {

  @Input() municData: MunicipalityData;
  @Output('hideModal') hideEvent: EventEmitter<boolean>;
  translate = translate;
  municDataCopy: MunicipalityData;

  constructor(private dataService: DataService) {
    this.hideEvent = new EventEmitter();
  }

  ngOnInit() {
    this.municDataCopy = Object.assign({}, this.municData)
    this.municDataCopy.ISIN = translate(this.municData.ISIN);
    this.municData = this.municDataCopy;
  }

  cancel() {
    this.hideEvent.emit(true);
  }

  save(isin: string) {
    this.municDataCopy.ISIN = translate(isin);
    this.dataService.editMunicData(this.municDataCopy);
    this.hideEvent.emit(true);
  }

}
