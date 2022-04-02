import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../search/search.page';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  currentBook:any;
  currentBeacon: number = 0;

  constructor(private httpClient: HttpClient) {
         
   }
    
   getBooks(){
     let url = 'https://smart-library-api.herokuapp.com/book-catalogue?secret_token=' + localStorage.getItem("sessionToken");
     return this.httpClient.get(url);
   }

   getMyBooks(){    
    let url = 'https://smart-library-api.herokuapp.com/my-subscriptions?userId=1&secret_token=' + localStorage.getItem("sessionToken");
    return this.httpClient.get(url);
  }

  checkoutBook(){
    let url = 'https://smart-library-api.herokuapp.com/book-subscription';
    let bookSub = {
      "bookId": this.currentBook.bookId,
      "userId": localStorage.getItem('userId'),
      "secret_token": localStorage.getItem('sessionToken'),
      "action": "subscribe"
    }    
    console.log(bookSub);
    return this.httpClient.post<any>(url, bookSub);
  }

  lightLed(){
    let url = 'https://smart-library-api.herokuapp.com/user-proximity?userId=' + localStorage.getItem("userId") + "&beaconId=" + this.currentBeacon.toString();
    return this.httpClient.get(url);
  }
   
}
