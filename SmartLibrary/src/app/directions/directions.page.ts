import { Component, OnInit, NgZone } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import {SmartBeaconPlugin} from '@ionic-native/smart-beacon-plugin/ngx'
declare var window:any
@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  
  constructor(private ngZone: NgZone,private smartBeacon: SmartBeaconPlugin) { }

  ngOnInit() {

  }

  async scan(){
    this.smartBeacon.scan().then(list => {
      for(var i=0; i<list.length; i++) {
        var beacon = list[i];
        console.log("I have found this beacon:")
        console.log(beacon.url);
        console.log(beacon.mac);
        console.log(beacon.distance);
        console.log(beacon.timestamp);
        console.log(beacon.rssi);
        console.log(beacon.txPower);
        this.devices.push(beacon);
    }
    }).catch((e) => {
      console.error(e);
    })
    // await BleClient.initialize({ androidNeverForLocation: true });
    // await BleClient.requestLEScan(
    //   {
    //     services: [],
    //   },
    //   (result) => {
    //     console.log("DEVICE FOUND");
    //     this.deviceFound(result);
    //   }
    // );

    // setTimeout(async () => {
    //   await BleClient.stopLEScan();
    //   console.log('stopped scanning');
    // }, 5000);
  }

  deviceFound(device){
    this.scanStatus = device.id;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }

}
