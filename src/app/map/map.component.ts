import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { DataService } from '../data-service/data.service'
import { FeatureCollection, Feature, MunicipalityData } from '../models/models'
import { translate } from '../helpers/translate'

@Component({
  selector: 'jr-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
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
  modalDisplay = false;
  municData: MunicipalityData

  constructor(private dataService: DataService) { }

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
    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    const width = 600 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    const mapContainer = d3.select(viz).append('div')
      .attr('id', 'map-container')
      .style('padding-bottom', 100 * (height + margin.top + margin.bottom) / (width + margin.left + margin.right) + '%');
    this.svg = mapContainer.append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('id', 'margins-container')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    this.svgInner = this.svg.append('g')
      .attr('id', 'svg-inner-container');
    const zoomed = () => { console.log(d3.event)
      this.svgInner.attr('transform', d3.event.transform)
    }
    const zoom: any = d3.zoom();
    zoom.scaleExtent([1, 3])
      .on('zoom', zoomed);
    this.svg.call(zoom);
  }

  drawMap(featureCollection: FeatureCollection) {
    const xym = d3.geoMercator()
      .center([6.46, 52.77])
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

    this.dataService.getData();

    this.svgInner.append('g')
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
    this.pathElements.each(function(d: any, i: number) {
      d3.select(this).attr('class', translate(data[i].ISIN))
    });
  }

  showDialogModal(d: Feature, i: number) {
    this.municData = this.data[i];
    this.modalDisplay = true;
  }

  hideDialogModal(event: boolean) {
    this.modalDisplay = false;
  }

  reload() {
    window.location.reload();
  }
}
