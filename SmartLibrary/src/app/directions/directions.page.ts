import { Component, OnInit, NgZone } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { IBeacon, IBeaconPluginResult } from '@awesome-cordova-plugins/ibeacon/ngx';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  declare ngCordovaBeacon: any;
  
  constructor(private ngZone: NgZone, private ibeacon: IBeacon) { }

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

  ibeaconScan(){
    console.log("HERE CODE");
    let uuid = 'A495BB10-C5B1-4B44-B512-1370F02D74DE'

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => {
          console.log('didRangeBeaconsInRegion: ', JSON.stringify(data));
          this.scanStatus = JSON.stringify(data);
        },
          error => console.error()
      );
    
      delegate.didDetermineStateForRegion().subscribe((data: IBeaconPluginResult) => {
      console.log(data.state);
      });

      delegate.didStartMonitoringForRegion()
      .subscribe(
        data => {
          //this.scanStatus = JSON.stringify(JSON.stringify(data));
          console.log('didStartMonitoringForRegion: ', JSON.stringify(data));
        },
        error => console.error()
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', data);
        }
      );

    let beaconRegion = this.ibeacon.BeaconRegion('espBeacon', uuid, 100, 1001);

    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
      );

      this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(
        () => console.log('Ranging'),
        error => console.error('Error Ranging ', error)
      );

  }

  deviceFound(device){
    this.scanStatus = device.id;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }

}
