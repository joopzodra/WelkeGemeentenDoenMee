import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { FeatureCollection, MunicipalityData } from '../models/models'
import { DataStore, LOAD, EDIT } from '../data-store/data.store'

@Injectable()
export class DataService {

  public featureCollection$: Observable<FeatureCollection>
  public municipalityData$: Observable<MunicipalityData[]>
  public dataErr$ = new BehaviorSubject<boolean>(false)

  constructor(private http: Http, private dataStore: DataStore) {
    this.getTopology();
    this.municipalityData$ = this.dataStore.data$;
    this.dataStore.data$.subscribe(data => this.storeLocal(data))
  }

  private getTopology() {
    this.featureCollection$ = this.http.get('assets/gem-2016.json')
      .map(res => res.json())
      .map((topo) => topojson.feature(topo, topo.objects["gem-2016-data-wgs84"]));
  }

  private getCsv() {
    return this.http.get('assets/gem-2016-data.csv')
      .do(() => this.dataErr$.next(false))
      .map(res => res.text().split('\n'))
      .map(rows => rows.map(row => row.split(',')))
      .do(rows => rows.shift()) // delete first row with column names     
      .map((rows): MunicipalityData[] => rows.map((row) => ({ MUN_CODE: row[0], MUN_NAME: row[1], ISIN: row[2] })));
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
