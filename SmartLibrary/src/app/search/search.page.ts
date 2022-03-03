import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit {
  public bookList: Book[];
  public searchTerm: string;

  constructor(private bookService: BookService) {
  }

  ngOnInit() {
    this.bookService.getBooks().subscribe((result:Book[]) => {
      console.log(result);
      this.bookList = result;
    });
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
