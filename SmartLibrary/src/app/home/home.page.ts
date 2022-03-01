import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  devices:any[] = [];
  scanStatus:String = '';

  constructor(private ble: BLE, private ngZone: NgZone) {}

  scan(){
    this.devices = []
    this.ble.scan([], 15).subscribe(
      device => this.deviceFound(device)
    );
  }

  deviceFound(device){
    this.scanStatus = device.name;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }
}
