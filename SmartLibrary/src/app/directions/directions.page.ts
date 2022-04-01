import { Component, OnInit, NgZone } from '@angular/core';
import { SmartBeaconPlugin } from '@ionic-native/smart-beacon-plugin/ngx';
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
  currentPositionY = 49;
  currentPositionX = 10;
  beaconX = 3;
  beaconY = 30;
  previousDistance:number = 0;

  numberOfResponses:number = 0;
  
  constructor(private ngZone: NgZone, private deviceOrientation: DeviceOrientation, private smartBeacon: SmartBeaconPlugin, private androidPermissions: AndroidPermissions) { }

  ngOnInit() {
    let options = {
      //every 1 second
      frequency: 1000
    };
    
    this.deviceOrientation.watchHeading(options).subscribe(
      (data: DeviceOrientationCompassHeading) => {
        this.heading = this.getDirectionFromHeading(data.trueHeading);
      },
      (error: any) => {
        console.log(error);
      }
    );
        
    // create a 25m x 10m grid using 0.5m blocks
    for(let i:number = 0; i < 50; i++) {
        this.floorPlan[i] = [];
        for(let j:number = 0; j< 20; j++) {
            this.floorPlan[i][j] = '.';
        }
    }
    this.floorPlan[this.beaconY][this.beaconX] = "@";
    console.log(this.floorPlan);
    //this.updateMap();
    this.smartBeaconScan();
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

  async onScanResult(result){
    console.log(result.length);
    this.numberOfResponses++; 
    this.scanStatus = "Response: " + this.numberOfResponses.toString();
    let latestBeacon = result[result.length - 1];
    this.updateMap(latestBeacon.distance);
  }

  smartBeaconScan(){
    //check permission
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if(result.hasPermission){
          //this.scanStatus = "Starting Scan";
          setInterval(() => {
            this.smartBeacon.scan().then(result => {
              this.onScanResult(result);
            });
          }, 2000);
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
  async updateMap(beaconDistance:String) {
    this.beaconDistance = +beaconDistance;
    
    // function that automatically decreases beacon distance by 0.5m every 1 second
    // check if person has reached the book (currently set at a random threshold or if they are on the same square)
    if(this.beaconDistance < 0.01 || (this.currentPositionX == this.beaconX && this.currentPositionY == this.beaconY)) {
      console.log("book reached");
      this.bookReached = true;
    }
    else {
      this.floorPlan[this.currentPositionY][this.currentPositionX] = '.'        // remove the user from the current position on the map
      let distanceDifference = this.previousDistance - this.beaconDistance;     // calculate how much the person moved
      let distanceToMove = Math.floor(distanceDifference / 0.5);                // translate that distance into 0.5 meter blocks
      
      if(this.heading == "South") {
        this.currentPositionY += distanceToMove;    // moving forwards
      }
      else if (this.heading == "North") {
        this.currentPositionY -= distanceToMove;    // moving backwards     
      }
      else if (this.heading == "West") {
        this.currentPositionX += distanceToMove;    // moving right
      }
      else if (this.heading == "East") {
        this.currentPositionX -= distanceToMove;    // moving left
      }

    }
    
    /*
    // if person moves towards the book (smaller beacon distance)
    else if(this.beaconDistance < this.previousDistance) {
      this.floorPlan[this.currentPositionY][this.currentPositionX] = '.'        // remove the user from the current position on the map
      let distanceDifference = this.previousDistance - this.beaconDistance;     // calculate how much the person moved
      let distanceToMove = Math.floor(distanceDifference / 0.5);      // translate that distance into 0.5 meter blocks
      this.currentPositionY -= distanceToMove;                             // update map by moving the person forward
    }
    // if person moves away from the book (greater beacon distance)
    else if (this.beaconDistance > this.previousDistance) {
      this.floorPlan[this.currentPositionY][this.currentPositionX] = '.'        // remove the user from the current position on the map
      let distanceDifference = this.previousDistance - this.beaconDistance;     // calculate how much the person moved
      let distanceToMove = Math.floor(distanceDifference / 0.5);      // translate that distance into 0.5 meter blocks
      this.currentPositionY += distanceToMove;                             // update map by moving the person backwards
    }
    */
    
    this.previousDistance = this.beaconDistance;                                // update distance to book 
    this.floorPlan[this.currentPositionY][this.currentPositionX] = '1'          // reset the user to the new position on the map
        
  }

}
