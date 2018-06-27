import { Component, OnInit } from '@angular/core';
import { Book } from '../Book';
import {BOOKS} from '../mock-books';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {

  selectedBook: Book;

  onSelect(books: Book): void {
    this.selectedBook = books;
  }
  // books = BOOKS;

//   book: Book = {
//     key: 'key',
//     title: 'title',
//     edition_count: 'ed count',
//     authors: 'authors',
//     subject: 'subject',
//     counter: 1
// }

  constructor() { }

  ngOnInit() {
  }

}

