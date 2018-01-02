import { Component, OnInit } from '@angular/core';

import { DataService } from './data-service/data.service'

/**
 * AppComponent contains in its template the app buttons bar and handles the button events.
 */

@Component({
  selector: 'jr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  map = 'block';
  table = 'none';
  csvModalDisplay = false;

  constructor(private dataService: DataService) { }

  showMap() {
    this.map = 'block';
    this.table = 'none';
  }

  showTable() {
    this.table = 'block';
    this.map = 'none';
  }

  clearData() {
    this.dataService.clearData();
  }

  demoData() {
    this.dataService.demoData();
  }

  showCsvModal() {
    this.csvModalDisplay = true;
  }

  hideCsvModal() {
    this.csvModalDisplay = false;
  }

}