import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from '../data-service/data.service'
import { MunicipalityData } from '../models/models'

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
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'welke-gemeenten-doen-mee.csv';
    hiddenElement.click();

    this.hideEvent.next();
  }

  cancel() {
    this.hideEvent.next();
  }

}
