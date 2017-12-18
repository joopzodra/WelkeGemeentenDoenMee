import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './table/table.component';

import { DataService } from './data-service/data.service'
import { DataStore } from './data-store/data.store';
import { DialogModalComponent } from './dialog-modal/dialog-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TableComponent,
    DialogModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DataService,
    DataStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
