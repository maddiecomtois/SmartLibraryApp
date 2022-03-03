import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';

import { ScanPage } from './scan.page';

const routes: Routes = [
  {
    path: '',
    component: ScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NFC,
    Ndef]
})
export class ScanPageRoutingModule {}
