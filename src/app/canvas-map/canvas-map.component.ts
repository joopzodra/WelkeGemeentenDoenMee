import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3'
import * as topojson from 'topojson'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'

import { DataService } from '../data-service/data.service'
import { FeatureCollection, Feature, MunicipalityData, MergedFeature, MergedFeatureCollection } from '../models/models'
import { translate } from '../helpers/translate'
import { throttler } from '../helpers/throttler'
import { genColor } from '../helpers/color-generator'

@Component({
  selector: 'jr-canvas-map',
  templateUrl: './canvas-map.component.html',
  styleUrls: ['./canvas-map.component.scss']
})
export class CanvasMapComponent implements OnInit, AfterViewInit {

  featuresError = false;
  dataErr$: Observable<boolean>;
  @ViewChild('container') containerElRef: ElementRef;
  @ViewChild('canvas') canvasElRef: ElementRef;
  width = 600;
  height = 715;
  responsiveWidth = 600;
  responsiveHeight = 715;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  inMemCanvas: HTMLCanvasElement;
  inMemContext: CanvasRenderingContext2D;
  yesFeatures: MergedFeatureCollection;
  maybeFeatures: MergedFeatureCollection;
  noFeatures: MergedFeatureCollection;
  unknownFeatures: MergedFeatureCollection;
  allFeatures: FeatureCollection;
  yesColor = '#42b437';
  maybeColor = '#beda71';
  noColor = '#ffe5bc';
  unknownColor = '#eee';
  strokeColor = '#000';
  labels: any;
  modalDisplay = false;
  data: MunicipalityData[];
  municData: MunicipalityData;
  geoPath: any;
  inMemGeoPath: any;
  colorToMunic: any = {}
  k = 1;
  x = 0;
  y = 0;
  responsiveShrinking = 1;

  constructor(private dataService: DataService) {
    window.addEventListener('resize', () => {
      this.onContainerResize();
    })
  }

  ngOnInit() {
    this.dataErr$ = this.dataService.dataErr$;
  }

  ngAfterViewInit() {
    this.canvas = this.canvasElRef.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.inMemCanvas = document.createElement('canvas');
    this.inMemContext = this.inMemCanvas.getContext('2d');
    this.setGeoPath();
    Observable.combineLatest(this.dataService.featureCollection$, this.dataService.municipalityData$)
      .subscribe(
      ([featureCollection, data]) => {
        this.featuresError = false;
        this.allFeatures = featureCollection;
        this.data = data;
        this.mergeFeaturesAndData(featureCollection, data);
        this.onContainerResize();
      },
      err => this.featuresError = true
      );
    this.dataService.getData();
  }

  setGeoPath() {
    const xym = d3.geoMercator()
      .center([6.46, 52.6])
      .scale(8800);
    this.geoPath = d3.geoPath(xym)
      .context(this.context);
    this.inMemGeoPath = d3.geoPath(xym)
      .context(this.inMemContext);
  }

  onContainerResize() {
    const container: HTMLDivElement = this.containerElRef.nativeElement;
    const containerWidth = container.clientWidth;
    this.responsiveWidth = containerWidth;
    this.responsiveShrinking = containerWidth / this.width;
    this.responsiveHeight = this.responsiveShrinking * this.height;
    this.canvas.width = this.responsiveWidth;
    this.canvas.height = this.responsiveHeight;
    this.inMemCanvas.width = this.responsiveWidth;
    this.inMemCanvas.height = this.responsiveHeight;
    this.setZoom();
    this.drawMap();
    this.drawInMemMap();
  }
  testDate: any;
  setZoom() {
    const zoomed = (d3Event: any) => {
      this.k = d3Event.transform.k;
      this.x = d3Event.transform.x;
      this.y = d3Event.transform.y;
      /*      this.k = d3.event.transform.k;
            this.x = d3.event.transform.x;
            this.y = d3.event.transform.y;*/
      this.drawMap();
      this.drawInMemMap();
    }
    const zoom: any = d3.zoom();
    zoom.extent([[0, 0], [this.responsiveWidth, this.responsiveHeight]])
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [this.responsiveWidth, this.responsiveHeight]])
    //.on('zoom', zoomed)
      .on('zoom', () => throttler(zoomed, d3.event)) // Throttle to reduce computing on relative slow mobile processors
    d3.select(this.canvas)
      .call(zoom)
      .on('wheel', () => d3.event.preventDefault())
      .on('end', () =>  d3.event.preventDefault()) // This allows to check for d3.event.defaultPrevented. After zoom end event d3 also fires a click event. In the this.canvasClicked handler we can check for d3.event.defaultPrevented.  
      .on('click', () => this.canvasClicked());
  }

  mergeFeaturesAndData(featureCollection: FeatureCollection, data: MunicipalityData[]) {
    featureCollection.features.forEach((feature: Feature) => {
      const gmCode = feature.properties.GM_CODE;
      const isin = data.find(municDatum => municDatum.MUN_CODE === gmCode).ISIN;
      (<MergedFeature>feature).properties.ISIN = translate(isin);
    });

    this.yesFeatures = { type: 'FeatureCollection', features: [] };
    this.maybeFeatures = { type: 'FeatureCollection', features: [] };
    this.noFeatures = { type: 'FeatureCollection', features: [] };
    this.unknownFeatures = { type: 'FeatureCollection', features: [] };

    featureCollection.features.forEach((feature: MergedFeature) => {
      switch (feature.properties.ISIN) {
        case 'yes':
          this.yesFeatures.features.push(feature);
          break;
        case 'maybe':
          this.maybeFeatures.features.push(feature);
          break;
        case 'no':
          this.noFeatures.features.push(feature);
          break;
        case 'unknown':
          this.unknownFeatures.features.push(feature);
          break;
      }
    });
  }

  drawMap() {
    this.context.clearRect(0, 0, this.responsiveWidth, this.responsiveHeight);
    this.context.save();
    this.context.translate(this.x * this.responsiveShrinking, this.y * this.responsiveShrinking)
    this.context.scale(this.k * this.responsiveShrinking, this.k * this.responsiveShrinking);
    let fontSize;
    let sliceEnd = 3;
    if (this.k > 6) {
      fontSize = 2;
      sliceEnd = undefined;
    } else if (this.k > 4) {
      fontSize = 4;
    } else if (this.k > 1.8) {
      fontSize = 5;
    } else {
      fontSize = 8;
    }
    this.context.font = fontSize + 'px Lato, Monsterrat, sans-serif';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    this.context.beginPath();
    this.geoPath(this.yesFeatures);
    this.context.fillStyle = this.yesColor;
    this.context.fill();
    this.context.lineWidth = .5;
    this.context.strokeStyle = this.strokeColor;
    this.context.stroke();

    this.context.beginPath();
    this.geoPath(this.maybeFeatures);
    this.context.fillStyle = this.maybeColor;
    this.context.fill();
    this.context.lineWidth = .5;
    this.context.strokeStyle = this.strokeColor;
    this.context.stroke();

    this.context.beginPath();
    this.geoPath(this.noFeatures);
    this.context.fillStyle = this.noColor;
    this.context.fill();
    this.context.lineWidth = .5;
    this.context.strokeStyle = this.strokeColor;
    this.context.stroke();

    this.context.beginPath();
    this.geoPath(this.unknownFeatures);
    this.context.fillStyle = this.unknownColor;
    this.context.fill();
    this.context.lineWidth = .5;
    this.context.strokeStyle = this.strokeColor;
    this.context.stroke();

    this.context.fillStyle = '#000';
    this.allFeatures.features.forEach((feature: Feature) => {
      this.geoPath(feature);
      const center = this.geoPath.centroid(feature);
      this.context.fillText(feature.properties.GM_NAAM.slice(0, sliceEnd), center[0], center[1])
    });

    this.context.restore();
  }

  drawInMemMap() {
    this.inMemContext.clearRect(0, 0, this.width, this.height);
    this.inMemContext.save();
    this.inMemContext.translate(this.x * this.responsiveShrinking, this.y * this.responsiveShrinking)
    this.inMemContext.scale(this.k * this.responsiveShrinking, this.k * this.responsiveShrinking);
    this.allFeatures.features.forEach((feature: Feature) => {
      this.inMemContext.beginPath();
      this.inMemGeoPath(feature);
      const featureColor = genColor()
      this.inMemContext.fillStyle = featureColor;
      this.inMemContext.fill();
      this.colorToMunic[featureColor] = feature.properties.GM_NAAM;
    });
    this.inMemContext.restore();
  }

  canvasClicked() { console.log(d3.event)
    if (d3.event.defaultPrevented) {
      return;
    }
    const mouseX = d3.event.layerX || d3.event.offsetX;
    const mouseY = d3.event.layerY || d3.event.offsetY;
    const colorData = this.inMemContext.getImageData(mouseX, mouseY, 1, 1).data;
    const colorKey = 'rgb(' + colorData[0] + ',' + colorData[1] + ',' + colorData[2] + ')';
    if (colorKey === 'rgb(0,0,0)') {
      return; // rgb(0,0,0) means that you don't click on a feature, so with return we end here  
    }
    const municName = this.colorToMunic[colorKey];
    this.municData = this.data.find(datum => datum.MUN_NAME === municName);
    this.modalDisplay = true;
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
