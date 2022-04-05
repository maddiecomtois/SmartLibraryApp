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
  devices:any[] = []
  scanStatus:String = '';
  coordinates = '0 0';
  toMove = 0;
  bookReached:boolean = false;
  //heading:number = -1;
  permissions:any[] = [this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT, this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE, this.androidPermissions.PERMISSION.BLUETOOTH_SCAN, this.androidPermissions.PERMISSION.FOREGROUND_SERVICE, this.androidPermissions.PERMISSION.INTERNET, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION] 

  heading:String = '';
  floorPlan:string[][] = [];
  beaconDistance:number = 0;
  currentPositionY = 49;
  currentPositionX = 10;
  beacons:any = [];

  // will update in ngInit
  beaconX = 0;
  beaconY = 0;
  previousDistance:number = 0;

  numberOfResponses:number = 0;
  
  constructor(private ngZone: NgZone, private deviceOrientation: DeviceOrientation, private smartBeacon: SmartBeaconPlugin, private androidPermissions: AndroidPermissions, private bookService: BookService) { }

  ngOnInit() {
    this.beacons = [{
      "beaconId": 1001,
      "x_coordinate": 6,
      "y_coordinate": 30
    }, {
      "beaconId": 1002,
      "x_coordinate": 6,
      "y_coordinate": 10
    }];

    this.currentPositionX = 10;
    this.currentPositionY = 49;
    this.heading = 'South';

    // create a 25m x 10m grid using 0.5m blocks
    for(let i:number = 0; i < 50; i++) {
        this.floorPlan[i] = [];
        for(let j:number = 0; j< 20; j++) {
            this.floorPlan[i][j] = '.';
        }
    }
    console.log(this.floorPlan);

    // get target beacon
    let beacon = this.beacons.find(i => i.beaconId === this.bookService.currentBeacon);
    this.beaconX = beacon['x_coordinate'];
    this.beaconY = beacon['y_coordinate'];

    //set beacons and pointer on map
    this.floorPlan[this.currentPositionY][this.currentPositionX] = '1';
    this.floorPlan[30][6] = '@';
    this.floorPlan[10][6] = '@';

    //check permissions
    this.androidPermissions.requestPermissions(this.permissions);

    //get initial distance
    this.smartBeacon.scan().then(result => {
      for(let i = 0; i < result.length; i++){
        if(result[i].minor == this.bookService.currentBeacon){
          this.previousDistance = Math.round(result[i].distance * 10)/10;
          this.beaconDistance = this.previousDistance;
          break;
        }
      }
    });

    this.smartBeaconScan();
  }

  isBeaconCoordinate(i, j){;
    return i == this.beaconY && j == this.beaconX;
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
    this.smartBeacon.scan().then(result => {
      this.onScanResult(result);
    });
  }


  /*
    Y range: {0-49} ~25m
    X range: {0-19} ~10m
  */
  updateMap(beaconDistance:String) {
    this.scanStatus = "XCOORD: " + this.currentPositionX;
    this.beaconDistance = Math.round(+beaconDistance*10)/10;
    
    // function that automatically decreases beacon distance by 0.5m every 1 second
    // check if person has reached the book (currently set at a random threshold or if they are on the same square)
    if(this.beaconDistance <= 0.3 || (this.currentPositionX == this.beaconX && this.currentPositionY == this.beaconY)) {
      console.log("book reached");
      this.bookReached = true;
      
      //call LED endpoint
      this.bookService.lightLed().subscribe(response => {
        console.log(response);
      });
    }
    else {
      //get current heading
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
      
      //this.scanStatus = this.currentPositionY.toString();
      this.toMove = distanceToMove;

      if(this.heading == "South" || this.heading == "South West" || this.heading == "South East") {
        if((this.currentPositionY - distanceToMove) <= 49){
          this.currentPositionY -= distanceToMove;    // moving forwards
        }
      }
      else if (this.heading == "North") {
        if((this.currentPositionY + distanceToMove >= 0)){
          this.currentPositionY += distanceToMove;    // moving backwards     
        }
      }
      else if (this.heading == "West") {
        if((this.currentPositionX + distanceToMove) <= 19){
          this.currentPositionX += distanceToMove;    // moving right
        }
      }
      else if (this.heading == "East") {
        if((this.currentPositionX - distanceToMove) >= 0){
          this.currentPositionX -= distanceToMove;    // moving left
        }
      }

    }

    this.previousDistance = this.beaconDistance;                                // update distance to book 
    this.floorPlan[this.currentPositionY][this.currentPositionX] = '1'          // reset the user to the new position on the map

    //this.coordinates = this.currentPositionY.toString() + " " + this.currentPositionX.toString();
    
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
  }

}
