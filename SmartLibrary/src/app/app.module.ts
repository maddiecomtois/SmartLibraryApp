import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import {SmartBeaconPlugin} from '@ionic-native/smart-beacon-plugin/ngx'
//import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BookService } from './services/book.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  HttpClientModule],
  providers: [BLE, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },BookService,SmartBeaconPlugin],
  bootstrap: [AppComponent],
})
export class AppModule {}