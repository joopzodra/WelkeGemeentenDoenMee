import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/merge';
//import 'rxjs/add/operator/mergeMap';
//import 'rxjs/add/operator/combineLatest'; //BEWARE: combineLatest is available both as operator and observable
//
//import 'rxjs/add/observable/forkJoin';
//import 'rxjs/add/observable/of';
//import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/combineLatest';
