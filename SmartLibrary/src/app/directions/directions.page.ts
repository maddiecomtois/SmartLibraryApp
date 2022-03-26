import { Component, OnInit, NgZone } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation/ngx';



@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  bookReached:boolean = false;
  
  floorPlan:string[][] = [];
  beaconDistance:number = 0;
  beaconX = 3;
  beaconY = 30;
  
  constructor(private ngZone: NgZone, /*private deviceOrientation: DeviceOrientation*/) { }

  ngOnInit() {
    /*
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => console.log(data),
      (error: any) => console.log(error)
    );
    
    let subscription = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => console.log(data)
    );
    */
    
    //subscription.unsubscribe();
    
    // create a 25m x 10m grid using 0.5m blocks
    for(let i:number = 0; i < 50; i++) {
        this.floorPlan[i] = [];
        for(let j:number = 0; j< 20; j++) {
            this.floorPlan[i][j] = '.';
        }
    }
    this.floorPlan[this.beaconY][this.beaconX] = "@";
    console.log(this.floorPlan);
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
  
  /*
    Y range: {0-49} ~25m
    X range: {0-19} ~10m
  */
  updateMap() {
    this.beaconDistance = 15.2;
    let currentPositionY = 49;
    let currentPositionX = 10;
    let previousDistance = this.beaconDistance;
    
    // function that automatically decreases beacon distance by 0.5m every 1 second
    setInterval(() => {
      // check if person has reached the book (currently set at a random threshold or if they are on the same square)
      if(this.beaconDistance < 0.01 || (currentPositionX == this.beaconX && currentPositionY == this.beaconY)) {
        console.log("book reached");
        this.bookReached = true;
      }
      // if person moves towards the book (smaller beacon distance)
      else if(this.beaconDistance < previousDistance) {
        this.floorPlan[currentPositionY][currentPositionX] = '.'        // remove the user from the current position on the map
        let distanceDifference = previousDistance - this.beaconDistance;     // calculate how much the person moved
        let distanceToMove = Math.floor(distanceDifference / 0.5);      // translate that distance into 0.5 meter blocks
        currentPositionY -= distanceToMove;                             // update map by moving the person forward
      }
      // if person moves away from the book (greater beacon distance)
      else if (this.beaconDistance > previousDistance) {
        this.floorPlan[currentPositionY][currentPositionX] = '.'        // remove the user from the current position on the map
        let distanceDifference = previousDistance - this.beaconDistance;     // calculate how much the person moved
        let distanceToMove = Math.floor(distanceDifference / 0.5);      // translate that distance into 0.5 meter blocks
        currentPositionY += distanceToMove;                             // update map by moving the person backwards
      }
      
      previousDistance = this.beaconDistance;                                // update distance to book 
      this.floorPlan[currentPositionY][currentPositionX] = '1'          // reset the user to the new position on the map
      
      this.beaconDistance -= 0.5;
        
    }, 1000);
    
  }

}
