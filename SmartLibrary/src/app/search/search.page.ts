import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
   public searchField: FormControl;
   public foodList$: Observable<FoodItem[]>;

  book1:Book = {name:"book1", available:true}
  book2:Book = {name:"book2", available:false}
  book3:Book = {name:"book3", available:true}
  books = [
    this.book1,
    this.book2,
    this.book3
  ]

  constructor() {
    this.searchField = new FormControl('');
  }

  async ngOnInit() {
    const searchTerm$ = this.searchField.valueChanges.pipe(
      startWith(this.searchField.value)
    );
    
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

interface Book {
  name: string;
  available: boolean;
}
