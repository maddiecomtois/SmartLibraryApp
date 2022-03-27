import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../search/search.page';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpClient: HttpClient) {
         
   }
    
   getBooks(){
     let url = 'https://smart-library-api.herokuapp.com/book-catalogue';
     return this.httpClient.get(url);
   }

   getMyBooks(){    
    let url = 'https://smart-library-api.herokuapp.com/my-subscriptions?userId=1&secret_token=' + localStorage.getItem("sessionToken");
    return this.httpClient.get(url);
  }
   
}
