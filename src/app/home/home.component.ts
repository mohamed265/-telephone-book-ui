import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToUsers(): void {
    this.router.navigate(['list-user']);
  };

  goToLangs(): void {
    this.router.navigate(['list-lang']);
  };

  goToGovernorates(): void {
    this.router.navigate(['list-governorate']);
  };

  goToCities(): void {
    this.router.navigate(['list-city']);
  };
}
