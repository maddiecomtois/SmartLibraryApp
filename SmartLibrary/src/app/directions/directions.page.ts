import { Component, OnInit, NgZone } from '@angular/core';
import { SmartBeaconPlugin } from '@ionic-native/smart-beacon-plugin/ngx';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})

export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  
  constructor(private ngZone: NgZone, private smartBeacon: SmartBeaconPlugin) { }

  ngOnInit() {

  }

  onScanResult(result){
    console.log("In Scan Result");
    for(var i = 0; i < result.length; i++){
      let beacon = result[i];
      console.log("I found a beacon");
      this.deviceFound(beacon);
    }
  }

  smartBeaconScan(){
    this.scanStatus = "Starting Scan";
    this.smartBeacon.scan().then(result => {
      this.onScanResult(result);
    })
  }

  deviceFound(device){
    //this.scanStatus = device.id;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }

}
