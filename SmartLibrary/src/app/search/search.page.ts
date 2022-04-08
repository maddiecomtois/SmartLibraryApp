import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit {
  public bookList: Book[];
  public searchTerm: string;

  constructor(private bookService: BookService, private router:Router) {
  }

  /*
  * Get book catalogue from the data base
  */
  ngOnInit() {
    this.bookService.getBooks().subscribe((result:Book[]) => {
      console.log(result);
      this.bookList = result;
    });
  }

  /*
  * Route user to the directions page based on the book they have selected
  */
  chooseBook(book:any){
    this.bookService.currentBook = book;
    this.bookService.currentBeacon = book.beaconId;
    this.router.navigate(['/directions']);
  }
}

export interface Book {
  bookId: number;
  title: string;
  author: string;
  transaction: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
  available: boolean;
}
