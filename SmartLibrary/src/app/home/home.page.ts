import { Component } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  devices:any[] = [];
  scanStatus:String = '';
  device:String = '';

  constructor() {}

  async scan() {
    this.devices = [];
    try{
      await BleClient.initialize();
      await BleClient.requestLEScan(
        {
          services: [],
        },
        (result) => {
          this.scanStatus = 'Scanning';
          console.log("Scan ", result);
          this.devices = result[0];
        }
      );
      setTimeout(async () =>{
        await BleClient.stopLEScan();
        console.log("Stop Scanning");
        this.scanStatus = 'Done Scanning';
      }, 10000);
    }
    catch(error){
      console.log(error);
    }
  }

  anotherScan(){

  }
}
