import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BookService } from '../services/book.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit {
  public searchField: FormControl;
  public foodList$: Observable<FoodItem[]>;
  public bookList: Book[];



  constructor(private bookSerice: BookService) {
    this.searchField = new FormControl('');

  }

  async ngOnInit() {
    const searchTerm$ = this.searchField.valueChanges.pipe(
      startWith(this.searchField.value)
    );
    this.bookSerice.getBooks().subscribe((result:Book[]) => {
      console.log(result);
      this.bookList = result;
    });

    /*
    // tutorial: https://jsmobiledev.com/article/searchbar-firebase/
    const foodList$ = Observable.create(this.foods);

    this.foodList$ = combineLatest([foodList$, searchTerm$]).pipe(
      map(([foodList, searchTerm]) =>
        foodList.filter(
          (foodItem) =>
            searchTerm === '' ||
            foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    */

  }

}

interface FoodItem {
  name: string;
}

export interface Book {
  bookId: number;
  title: string;
  author: string;
  transaction: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}
