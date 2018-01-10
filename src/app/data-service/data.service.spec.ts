import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs/Subject'

import { stubMunicDataCsv } from '../testing/stub-munic-data-csv'
import { DataService } from './data.service';
import { DataStore } from '../data-store/data.store'
import { FeatureCollection, MunicipalityData } from '../models/models'

class StubDataStore {
  data$ = new Subject<MunicipalityData[]>();
}

describe('DataService', () => {

  let dataService: DataService;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService, {provide: DataStore, useClass: StubDataStore}]
    });
  });

  beforeEach(inject([DataService], (_dataService: DataService) => {
    dataService = _dataService;
  }))

  it('should create', () => {
    expect(dataService).toBeTruthy();
  });

  it('gets the csv data and converts it to the municipality data model', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    (<any>dataService).getCsv().subscribe((data: MunicipalityData[]) => {
      expect(data.length).toBe(3);
      expect(data[0].MUN_NAME).toBe('Appingedam');
    });
    const req = httpMock.expectOne('assets/gem-2016-data.csv');
    expect(req.request.method).toEqual('GET');
    req.flush(stubMunicDataCsv);
    httpMock.verify();
  }));

});
