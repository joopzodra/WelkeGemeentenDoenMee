import { Subject } from 'rxjs/Subject'
import { MunicipalityData } from '../models/models'

/**
 * DataStore is a redux data store. It has a reduce function to load or edit data. It's the single data source for the app.
 */

export const LOAD = 'LOAD'
export const EDIT = 'EDIT'

export class DataStore {
  private data_: MunicipalityData[] = [];
  public data$ = new Subject<MunicipalityData[]>();
  public dispatch(action: { type: string, data: MunicipalityData[] }) {
    this.data_ = this.reduce(this.data_, action);
    this.data$.next(this.data_);
  }
  private reduce(data: MunicipalityData[], action: { type: string, data: MunicipalityData[] }) {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case EDIT:
        const editedDatum = action.data[0]; // in EDIT action only one element in data array
        return data.map(datum => {
          if (datum.MUN_CODE !== editedDatum.MUN_CODE) {
            return datum;
          }
          return editedDatum;
        });
      default:
        return data;
    }
  }
}
