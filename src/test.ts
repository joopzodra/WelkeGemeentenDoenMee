// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/filter';
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/merge';
//import 'rxjs/add/operator/mergeMap';
//import 'rxjs/add/operator/combineLatest'; //BEWARE: combineLatest is available both as operator and observable
//import 'rxjs/add/operator/withLatestFrom';

//import 'rxjs/add/observable/forkJoin';
//import 'rxjs/add/observable/of';
//import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/combineLatest';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
