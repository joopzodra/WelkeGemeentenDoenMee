import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from '../data-service/data.service'
import { MunicipalityData } from '../models/models'

// saveAs is the only function of FileSaver.js. FileSaver.js is added to the scripts list in .angular-cli.json
declare const saveAs: any;

/**
 * CsvModalComponent handles the modal dialog for downloading the data to a csv file. It also converts the data to a format which can be downloaded as csv file.
 */

@Component({
  selector: 'jr-csv-modal',
  templateUrl: './csv-modal.component.html',
  styleUrls: ['./csv-modal.component.scss']
})
export class CsvModalComponent {

  @Output('hideModal') hideEvent: EventEmitter<void>;

  constructor(private dataService: DataService) {
    this.hideEvent = new EventEmitter();
  }

  download() {
    const data = this.dataService.municipalityData;
    let csv = 'GM_CODE;GM_NAAM;DM\n';
    data.forEach(datum => {
      csv += [datum.MUN_CODE, datum.MUN_NAME, datum.ISIN].join(';');
      csv += '\n';
    });
    const filename = 'welke-gemeenten-doen-mee.csv';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
    this.hideEvent.next();
  }

  cancel() {
    this.hideEvent.next();
  }

}
