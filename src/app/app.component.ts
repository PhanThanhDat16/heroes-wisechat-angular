import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { test } from './list-hero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'my-app';

  ngOnInit(): void {
    localStorage.setItem('heroes', JSON.stringify(test))
  }
}
