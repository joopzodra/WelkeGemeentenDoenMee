import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { FeatureCollection, MunicipalityData } from '../models/models'
import { DataStore, LOAD, EDIT } from '../data-store/data.store'

/**
 * DataService gets the topology from a geojson file. It gets demo data from a csv file. It stores the demo data in the data store and saves it in the browser's local storage. It handles all changes the user makes in the data. 
 */

@Injectable()
export class DataService {

  public featureCollection$: Observable<FeatureCollection>;
  public municipalityData$: Observable<MunicipalityData[]>;
  public dataErr$ = new BehaviorSubject<boolean>(false);
  public municipalityData: MunicipalityData[];

  constructor(private http: HttpClient, private dataStore: DataStore) {
    this.getTopology();
    this.municipalityData$ = this.dataStore.data$;
    this.dataStore.data$.subscribe(data => {
      this.storeLocal(data);
      this.municipalityData = data;
    })
  }

  private getTopology() {
    this.featureCollection$ = this.http.get<any>('assets/gem-2016.json')
      .map((topo) => topojson.feature(topo, topo.objects["gem-2016-data-wgs84"]));
  }

  private getCsv() {
    return this.http.get('assets/gem-2016-data.csv', {responseType: 'text'})
      .do(() => this.dataErr$.next(false))
      .map(res => res.split('\n'))
      .map(rows => rows.map(row => row.split(';')))
      .do(rows => rows.shift()) // delete first row with column names     
      .map((rows): MunicipalityData[] => rows.map((row) => ({ MUN_CODE: row[0], MUN_NAME: row[1], ISIN: row[2] })))
      .map(data => data.sort((a, b) => {
        const nameA = a.MUN_NAME.toLowerCase().replace('\'s-', ''); // the replace regex is to orden e.g. 's-Gravenhage on G
        const nameB = b.MUN_NAME.toLowerCase().replace('\'s-', '');
        return nameA < nameB ? -1 : 1;
      }));
  }

  public getData() {
    if (window.localStorage.getItem('gemeentenData')) {
      const data = window.localStorage.getItem('gemeentenData');
      const parsedData = JSON.parse(data);
      this.loadMunicData(parsedData);
    }
    else {
      this.getCsv().subscribe(
        (data: MunicipalityData[]) => {
          this.loadMunicData(data);
          this.storeLocal(data);
        },
        err => this.dataErr$.next(true)
      );
    }
  }

  private loadMunicData(data: MunicipalityData[]) {
    this.dataStore.dispatch({ type: LOAD, data: data });
  }

  private storeLocal(data: MunicipalityData[]) {
    const dataString = JSON.stringify(data);
    window.localStorage.setItem('gemeentenData', dataString);
  }

  public editMunicData(datum: MunicipalityData) {
    const data = [datum];
    this.dataStore.dispatch({ type: EDIT, data });
  }

  public clearData() {
    const data = window.localStorage.getItem('gemeentenData');
    const parsedData: MunicipalityData[] = JSON.parse(data);
    parsedData.forEach(d => d.ISIN = 'onbekend');
    this.loadMunicData(parsedData);
  }

  public demoData() {
    window.localStorage.removeItem('gemeentenData');
    this.getData();
  }

}
