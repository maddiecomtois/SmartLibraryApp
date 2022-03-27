import { Book } from '../search/search.page';
import { BookService } from '../services/book.service';
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public bookList : Book[]=[];
  constructor(public bookService : BookService, private ngZone: NgZone) {
    this.loadBooks();
  }

  loadBooks(){
    //console.log(localStorage.getItem("sessionToken"));
    this.bookService.getMyBooks().subscribe((result:Book[]) => {
      console.log(result);
      this.bookList = result;
    });
  }
}
