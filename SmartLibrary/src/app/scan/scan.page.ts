import { Component, NgZone } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { Platform } from '@ionic/angular';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage {
  
  private platform: Platform;
  private readerMode$;
  private scanResponse = "Click to scan book"

  constructor(private nfc: NFC, private ndef: Ndef, platform: Platform, private bookService: BookService) {
    this.platform = platform;
  }
  
  /*
  * Use NFC to scan the book tag (Android only)
  */
  async scanTag() {
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    if(this.platform.is('android')) {
      console.log("android detected")
       let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
       this.readerMode$ = this.nfc.readerMode(flags).subscribe(
           tag => {
            this.scanResponse = JSON.stringify(tag);
            this.bookService.checkoutBook().subscribe(response => {
              console.log(response);
              if(response == "Success" || response == "success"){
                this.scanResponse = "Book checked-out!"
              }
            });
           },
           err => this.scanResponse = 'Error reading tag'
       );
    }
    
    
  }
}
