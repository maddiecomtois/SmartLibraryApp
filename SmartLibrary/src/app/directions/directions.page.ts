import { Component, OnInit, NgZone } from '@angular/core';
import { SmartBeaconPlugin } from '@ionic-native/smart-beacon-plugin/ngx';
import { from } from 'rxjs';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})

export class DirectionsPage implements OnInit {
  devices:any[] = []
  scanStatus:String = '';
  bookReached:boolean = false;
  //heading:number = -1;
  permissions:any[] = [this.androidPermissions.PERMISSION.BLUETOOTH_SCAN, this.androidPermissions.PERMISSION.FOREGROUND_SERVICE, this.androidPermissions.PERMISSION.INTERNET, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION] 

  heading:String = '';
  floorPlan:string[][] = [];
  beaconDistance:number = 0;
  beaconX = 3;
  beaconY = 30;
  
  constructor(private ngZone: NgZone, private deviceOrientation: DeviceOrientation, private smartBeacon: SmartBeaconPlugin, private androidPermissions: AndroidPermissions) { }

  ngOnInit() {
    
    /*this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => {
        this.heading = data.magneticHeading;
      },
      (error: any) => console.log(error)
    );*/

    let options = {
      //every 1 second
      frequency: 1000
    };
    
    this.deviceOrientation.watchHeading(options).subscribe(
      (data: DeviceOrientationCompassHeading) => {
        //this.heading = data.trueHeading;
        this.heading = this.getDirectionFromHeading(data.trueHeading);
      },
      (error: any) => {
        console.log(error);
      }
    );
    
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

  getDirectionFromHeading(heading){
    if((heading >= 0 && heading <= 21) || (heading >= 337 && heading <= 360)){
      return "North";
    }
    else if(heading >=157 && heading <= 201){
      return "South";
    }
    else if(heading >= 68 && heading <= 111){
      return "East";
    }
    else if(heading >= 249 && heading <= 292){
      return "West";
    }
    else if(heading >= 22 && heading <= 67){
      return "North East";
    }
    else if(heading >= 112 && heading <= 156){
      return "South East";
    }
    else if(heading >= 293 && heading <= 336){
      return "North West";
    }
    else if(heading >= 202 && heading <= 248){
      return "South West";
    }
  }

  onScanResult(result){
    console.log(result.length);
    let latestBeacon = result[result.length - 1];
    this.scanStatus = latestBeacon.distance;
  }

  smartBeaconScan(){
    this.scanStatus = "Starting Scan";
    // const beaconScanObserver = from(this.smartBeacon.scan())
    // beaconScanObserver.subscribe(
    //   result => {
    //       this.onScanResult(result);
    //     })
    setInterval(() => {
      console.log('In set interval')
      this.smartBeacon.scan().then(result => {
        this.onScanResult(result);
      })
    }, 2000);
   
    //check permission
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if(result.hasPermission){
          //this.scanStatus = "Starting Scan";
          setInterval(() => {
            this.smartBeacon.scan().then(result => {
              this.onScanResult(result);
            });
          }, 1000);
        }
        else{
          this.androidPermissions.requestPermissions(this.permissions)
        } 
      }
    );
  }

  deviceFound(device){
    //this.scanStatus = device.id;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }
  
  /*
    Y range: {0-49} ~25m
    X range: {0-19} ~10m
  */
  updateMap() {
    
    let currentPositionY = 49;
    let currentPositionX = 10;
    let previousDistance = this.beaconDistance;
    
    // function that automatically decreases beacon distance by 0.5m every 1 second
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
    
  }

}
