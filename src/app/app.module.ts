import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './table/table.component';

import { DataService } from './data-service/data.service'
import { DataStore } from './data-store/data.store';
import { DialogModalComponent } from './dialog-modal/dialog-modal.component';
import { CanvasMapComponent } from './canvas-map/canvas-map.component';
import { PanelAnimationDirective } from './helpers/panel-animation.directive';
import { CsvModalComponent } from './csv-modal/csv-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TableComponent,
    DialogModalComponent,
    CanvasMapComponent,
    PanelAnimationDirective,
    CsvModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    DataStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
