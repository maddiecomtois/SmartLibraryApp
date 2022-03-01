import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  
  private platform: Platform;
  readerMode$;
  scanResponse = "no response"

  constructor(private nfc: NFC, private ndef: Ndef, platform: Platform) {
    this.platform = platform;
  }

  ngOnInit() {
  }
  
  async scanTag() {
    // Read NFC Tag - iOS
    // On iOS, a NFC reader session takes control from your app while scanning tags then returns a tag
    if(this.platform.is('ios')) {
      console.log("this is read")
      try {
          let tag = await this.nfc.scanNdef();
          console.log(JSON.stringify(tag));
          this.scanResponse = JSON.stringify(tag);
       } catch (err) {
           console.log('Error reading tag', err);
       }
    }
    
    // Read NFC Tag - Android
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    if(this.platform.is('android')) {
      console.log("android is read")
       let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
       this.readerMode$ = this.nfc.readerMode(flags).subscribe(
           tag => this.scanResponse = JSON.stringify(tag),
           err => this.scanResponse = 'Error reading tag'
       );
    }
    
    
  }

}
