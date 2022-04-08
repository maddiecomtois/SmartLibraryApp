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

  constructor(private httpClient: HttpClient) {}
  
  /*
  * GET request: return the book catalogue from the data base
  */
   getBooks(){
     let url = 'https://smart-library-api.herokuapp.com/book-catalogue?secret_token=' + localStorage.getItem("sessionToken");
     return this.httpClient.get(url);
   }

   /*
   * GET request: return a list of books the user has currently checked out
   */
   getMyBooks(){    
    let url = 'https://smart-library-api.herokuapp.com/my-subscriptions?userId=1&secret_token=' + localStorage.getItem("sessionToken");
    return this.httpClient.get(url);
  }

  /*
  * POST request: check out a book by marking it unavailable in the data base
  */
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

  /*
  * GET request: get the LED information to turn on the light for the given book
  */
  lightLed(){
    let url = 'https://smart-library-api.herokuapp.com/user-proximity?userId=' + localStorage.getItem("userId") + "&beaconId=" + this.currentBeacon;
    return this.httpClient.get(url);
  }
   
}
