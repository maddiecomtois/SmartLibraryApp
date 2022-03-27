import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SmartBeaconPlugin } from '@ionic-native/smart-beacon-plugin/ngx';


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
  providers: [SmartBeaconPlugin, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },BookService],
  bootstrap: [AppComponent],
})
export class AppModule {}