import { Subject } from 'rxjs/Subject'

import { DataStore, LOAD, EDIT } from './data.store'
import { MunicipalityData } from '../models/models'
import { stubMunicipalityData } from '../testing/stub-municipality-data'

describe('DataStore', () => {

  let dataStore: DataStore;
  let data: MunicipalityData[];

  beforeEach(() => {
    dataStore = new DataStore();
    data = stubMunicipalityData;
  });

  it('should create', () => {
    expect(dataStore).toBeTruthy();
  });

  it('reduces LOAD actions', () => {
    const data_ = (<any>dataStore).data_;
    const newData = (<any>dataStore).reduce(data_, {type: LOAD, data: stubMunicipalityData});
    expect(newData).not.toBe(stubMunicipalityData);
    expect(newData).toEqual(stubMunicipalityData);

  });

  it('reduces EDIT actions', () => {
    (<any>dataStore).data_ = stubMunicipalityData;
    const newDatum: MunicipalityData[] = [{"MUN_CODE":"GM0003","MUN_NAME":"Appingedam","ISIN":"ja"}] // in stubMunicipalityData ISIN = 'belangstelling'
    const newData = (<any>dataStore).reduce((<any>dataStore).data_, {type: EDIT, data: newDatum});
    expect(newData.filter(d => d.MUN_CODE === 'GM0003')[0].ISIN).toBe('ja');
  });

});
