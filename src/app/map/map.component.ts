import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { DataService } from '../data-service/data.service'
import { FeatureCollection, Feature, MunicipalityData } from '../models/models'
import { translate } from '../helpers/translate'
import { Throttler } from '../helpers/throttler'

/** 
 * MapComponent creates an svg and draws the map in it, using the topology it gets from the DataService. It colors the topology according to the data. Clicking on a municipality on the map shows the dialog modal, which enables the user to change the data of the municipality.
 * 
 * NB. If you want to use both canvas-map and svg-map you have to uncomment this line in the canvas map component:
 *     this.dataService.getData();
 *     Otherwise the pathes in the svg map won't be colored properly.
*/

@Component({
  selector: 'jr-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [Throttler]
})
export class MapComponent implements OnInit {

  featuresError = false;
  dataError = false;
  data: MunicipalityData[];
  dataErr$: BehaviorSubject<boolean>;
  @ViewChild('viz') viz: ElementRef;
  pathElements: any;
  svg: any;
  svgInner: any;
  labels: any;
  modalDisplay = false;
  municData: MunicipalityData;
  width = 600;
  height = 715;
  zoomK = 1;
  zoomX = 0;
  zoomY = 0;

  constructor(private dataService: DataService, private throttler: Throttler) { }

  ngOnInit() {
    this.dataService.featureCollection$.subscribe(
      featureCollection => {
        this.featuresError = false;
        this.setSvg();
        this.drawMap(featureCollection);
      },
      err => this.featuresError = true
    );
    this.dataService.municipalityData$.subscribe(data => {
      this.setPathClass(data);
      this.data = data;
    });
    this.dataErr$ = this.dataService.dataErr$;
  }

  setSvg() {
    const viz = this.viz.nativeElement;
    const mapContainer = d3.select(viz).append('div')
      .attr('id', 'map-container')
      .style('padding-bottom', (100 * this.height / this.width) + '%');
    this.svg = mapContainer.append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svgInner = this.svg.append('g')
      .attr('id', 'svg-inner-container');
    const zoomed = (d3Event: any) => {
      this.svgInner.attr('transform', d3Event.transform);
      this.setLabelFontSize(d3Event);
    }
    const zoom: any = d3.zoom();
    zoom.extent([[0, 0], [this.width, this.height]])
    zoom.scaleExtent([1, 8])
    zoom.translateExtent([[0, 0], [this.width, this.height]])
      .on('zoom', () => this.throttler.throttle(zoomed, d3.event));
    this.svg.call(zoom);
  }

  drawMap(featureCollection: FeatureCollection) {
    const xym = d3.geoMercator()
      .center([6.46, 52.6])
      .scale(8800);
    const geoPath = d3.geoPath(xym);
    this.pathElements = this.svgInner.append('g')
      .attr('id', 'geo-pathes')
      .selectAll('path')
      .data(featureCollection.features)
      .enter()
      .append('path')
      .attr('d', geoPath)
      .on('click', (d: any, i: number) => this.showDialogModal(d, i))
      .on('click.zoom', (): null => null);

    this.dataService.getData();

    this.labels = this.svgInner.append('g')
      .attr('id', 'labels')
      .selectAll('.label')
      .data(featureCollection.features)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d: any) => geoPath.centroid(d)[0])
      .attr('y', (d: any) => geoPath.centroid(d)[1])
      .text((d: Feature) => d.properties.GM_NAAM.slice(0, 3));

  }

  setPathClass(data: MunicipalityData[]) {
    this.pathElements.each(function(d: Feature) {
      const municCode = d.properties.GM_CODE;
      const municipality = data.find(datum => datum.MUN_CODE === municCode);
      d3.select(this).attr('class', translate(municipality.ISIN))
    });
  }

  setLabelFontSize(d3Event: any) {
    const scale = d3Event.transform.k;
    this.labels.style('font-size', 8 / (Math.sqrt(scale)) + 'px');
    if (scale > 7) {
      this.labels.text((d: Feature) => d.properties.GM_NAAM);
    } else {
      this.labels.text((d: Feature) => d.properties.GM_NAAM.slice(0, 3));
    }
  }

  showDialogModal(d: Feature, i: number) {
    this.municData = this.data.find(datum => datum.MUN_CODE === d.properties.GM_CODE);
    this.modalDisplay = true;
  }

  hideDialogModal(event: boolean) {
    this.modalDisplay = false;
  }

  reload() {
    window.location.reload();
  }
}
