import { Book } from '../search/search.page';
import { BookService } from '../services/book.service';
import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public bookList : Book[]=[];
  constructor(public bookService : BookService,private ble: BLE, private ngZone: NgZone) {
    this.loadBooks();
  }

  loadBooks(){
    this.bookService.getMyBooks().subscribe((result:Book[]) => {
      console.log(result);
      this.bookList = result;
    });
  }
  devices:any[] = [];
  scanStatus:String = '';

  scan(){
    this.devices = []
    this.ble.scan([], 15).subscribe(
      device => this.deviceFound(device)
    );
  }

  deviceFound(device){
    this.scanStatus = device.name;
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }
}
