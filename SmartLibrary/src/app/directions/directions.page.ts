import { Component, OnInit, NgZone } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';


@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  
  constructor(private ngZone: NgZone) { }

  ngOnInit() {

  }

  async scan(){
    await BleClient.initialize({ androidNeverForLocation: true });
    await BleClient.requestLEScan(
      {
        services: [],
      },
      (result) => {
        console.log("DEVICE FOUND");
        this.deviceFound(result);
      }
    );

    setTimeout(async () => {
      await BleClient.stopLEScan();
      console.log('stopped scanning');
    }, 5000);
  }

  deviceFound(device){
    this.scanStatus = device.id;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }

}
