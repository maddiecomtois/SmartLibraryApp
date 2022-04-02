import { Component, OnInit, NgZone } from '@angular/core';
import { SmartBeaconPlugin } from '@ionic-native/smart-beacon-plugin/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})

export class DirectionsPage implements OnInit {
  //devices:any[] = []
  scanStatus:String = '';
  bookReached:boolean = false;
  //heading:number = -1;
  permissions:any[] = [this.androidPermissions.PERMISSION.BLUETOOTH_SCAN, this.androidPermissions.PERMISSION.FOREGROUND_SERVICE, this.androidPermissions.PERMISSION.INTERNET, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION] 

  heading:String = '';
  floorPlan:string[][] = [];
  beaconDistance:number = 0;
  currentPositionY = 9;
  currentPositionX = 7;
  
  testMapping:number[] = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5 , 1, 0.5, 0.3]; 
  testHeadings:String[] = ['North', 'North', 'North', 'North', 'North', 'East', 'North', 'East', 'North'];

  // will update in ngInit
  beaconX = 0;
  beaconY = 0;
  previousDistance:number = 5;

  beacons:any = [{
    "beaconId": 1001,
    "x_coordinate": 0,
    "y_coordinate": 0
  }, {
    "beaconId": 1002,
    "x_coordinate": 0,
    "y_coordinate": 0
  }]

  numberOfResponses:number = 0;
  
  constructor(private ngZone: NgZone, private deviceOrientation: DeviceOrientation, private smartBeacon: SmartBeaconPlugin, private androidPermissions: AndroidPermissions, private bookService: BookService) { }

  ngOnInit() {
    console.log(this.testMapping);
    let options = {
      //every 1 second
      frequency: 1000
    };
    
    /*
    this.deviceOrientation.watchHeading(options).subscribe(
      (data: DeviceOrientationCompassHeading) => {
        this.heading = this.getDirectionFromHeading(data.trueHeading);
      },
      (error: any) => {
        console.log(error);
      }
    );*/
        
    // create a 25m x 10m grid using 0.5m blocks
    for(let i:number = 0; i < 10; i++) {
        this.floorPlan[i] = [];
        for(let j:number = 0; j< 13; j++) {
            this.floorPlan[i][j] = '.';
        }
    }
    console.log(this.floorPlan);

    // get target beacon
    //let beacon = this.beacons.find(i => i.beaconId === this.bookService.currentBeacon);
    //this.beaconX = beacon['x_coordinate'];
    //this.beaconY = beacon['y_coordinate'];
    this.floorPlan[2][2] = "@";
    this.floorPlan[7][10] = "@";
    this.floorPlan[this.currentPositionY][this.currentPositionX] = '1'
    
    /*for(let i = 0; i < this.testMapping.length; i++){
      (i => {
        setTimeout(() => {
          this.heading = this.testHeadings[i];
          this.updateMap(this.testMapping[i].toString());
        }, 1500 * (i+1));
      })(i);
    }*/

    //console.log(beacon);
    console.log(this.beaconX);
    console.log(this.beaconY);

    //get initial distance
    this.smartBeacon.scan().then(result => {
      for(let i = 0; i < result.length; i++){
        if(result[i].minor == this.bookService.currentBeacon){
          this.previousDistance = result[i].minor;
          this.beaconDistance = this.previousDistance;
          break;
        }
      }
    })
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
    for(let i = 0; i < result.length; i++){
      if(result[i].minor == this.bookService.currentBeacon){
        this.updateMap(result[i].distance);
      } 
    }
  }

  smartBeaconScan(){
    //check permission
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if(result.hasPermission){
          this.smartBeacon.scan().then(result => {
            this.onScanResult(result);
          });
        }
        else{
          this.androidPermissions.requestPermissions(this.permissions)
        } 
      }
    );
  }

  /*
  deviceFound(device){
    //this.scanStatus = device.id;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }*/
  
  /*
    Y range: {0-49} ~25m
    X range: {0-19} ~10m
  */
  updateMap(beaconDistance:String) {
    this.beaconDistance = Math.round(+beaconDistance*10)/10;
    
    // function that automatically decreases beacon distance by 0.5m every 1 second
    // check if person has reached the book (currently set at a random threshold or if they are on the same square)
    if(this.beaconDistance < 0.5 || (this.currentPositionX == this.beaconX && this.currentPositionY == this.beaconY)) {
      console.log("book reached");
      this.bookReached = true;
      
      //call LED endpoint
      this.bookService.lightLed();

    }
    else {
      this.deviceOrientation.getCurrentHeading().then(
        (data: DeviceOrientationCompassHeading) => {
          this.heading = this.getDirectionFromHeading(data.trueHeading);
        },
        (error: any) => {
          console.log(error);
        }
      );
      
      this.floorPlan[this.currentPositionY][this.currentPositionX] = '.'        // remove the user from the current position on the map
      let distanceDifference = this.previousDistance - this.beaconDistance;     // calculate how much the person moved
      let distanceToMove = Math.floor(distanceDifference / 0.5);                // translate that distance into 0.5 meter blocks
      
      if(this.heading == "South") {
        if((this.currentPositionY += distanceToMove) >= 0){
            this.currentPositionY += distanceToMove;    // moving forwards
            console.log(this.currentPositionY);
        }
      }
      else if (this.heading == "North") {
        if((this.currentPositionY -= distanceToMove) <= 13){
          this.currentPositionY -= distanceToMove;    // moving backwards     
        }
      }
      else if (this.heading == "West") {
        if((this.currentPositionX += distanceToMove) <= 10){
          this.currentPositionX += distanceToMove;    // moving right
          
        }
      }
      else if (this.heading == "East") {
        if((this.currentPositionX -= distanceToMove) >=0){
          this.currentPositionX -= distanceToMove;    // moving left
        }
      }
    }
    
    /*

    }
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
  
    console.log("MAP UPDATED");
  }

}
