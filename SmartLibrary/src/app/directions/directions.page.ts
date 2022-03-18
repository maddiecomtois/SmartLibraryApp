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
  distanceToBook:number = 0;
  bookReached:boolean = false;
  map:any[][] = [[0, 0, 0],
                [100, 100, 100],
                [200, 200, 200],
                [300, 300, 300],
                [400, 400, 400],
                [500, 500, 500]]
                
  displayMap:any[][] = [[0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]]
  
  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.updateMap();
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
  
  updateMap() {
    this.distanceToBook = 500;
    let currentPositionY = 5;
    let currentPositionX = 1;
    
    setInterval(() => {
      
      if (this.distanceToBook < this.map[currentPositionY][currentPositionX]) {
        this.displayMap[currentPositionY][currentPositionX] = 0;
        currentPositionY = currentPositionY - 1;
      }
      
      if(currentPositionY < 0) {
        console.log("book reached");
        this.bookReached = true;
      }
      else {
        this.distanceToBook = this.distanceToBook - 50;
        console.log("Distance to go: ", this.distanceToBook);
        this.displayMap[currentPositionY][currentPositionX] = 1;
      }
      
    }, 2000);

  }

}
