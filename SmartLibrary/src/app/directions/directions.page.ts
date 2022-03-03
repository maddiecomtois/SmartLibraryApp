import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
//import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BleClient } from '@capacitor-community/bluetooth-le';


@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  
  constructor(private ble: BLE, private ngZone: NgZone, private androidPermissions: AndroidPermissions) { }

  ngOnInit() {

  }

  permissionToScan(){
    
  }

  scan(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN).then(
      result => {
        console.log("PERMISSION: ", result.hasPermission)
        if(!result.hasPermission){
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN);
        }
        else{
          this.devices = []
          this.ble.scan([], 15).subscribe(
            device => {
              this.scanStatus = 'device found';
              this.deviceFound(device)
            }
          );
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN)
    )
  }

  async anotherScan(){
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
