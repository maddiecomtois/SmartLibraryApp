import { Component } from '@angular/core';
import { Book } from '../search/search.page';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public bookList : Book[]=[];
  constructor(public bookService : BookService) {
    this.loadBooks();
  }

  loadBooks(){
    this.bookService.getMyBooks().subscribe((result:Book[]) => {
      console.log(result);
      this.bookList = result;
    });
  }

}
