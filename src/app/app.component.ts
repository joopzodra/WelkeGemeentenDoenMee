import { Component, OnInit } from '@angular/core';

import {DataService } from './data-service/data.service'

@Component({
  selector: 'jr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  map = 'block';
  table = 'none';

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
}