import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-list-lang',
  templateUrl: './list-lang.component.html',
  styleUrls: ['./list-lang.component.css']
})
export class ListLangComponent implements OnInit {

  langs: any[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getLangs()
      .subscribe(response => {
        this.langs = response['data'];
      });
  }

  deleteLang(lang): void {
    this.apiService.deleteLang(lang.isoCode)
      .subscribe(data => {
        this.langs = this.langs.filter(u => u !== lang);
      })
  };

  editLang(lang): void {
    window.localStorage.removeItem("editLangIsoCode");
    window.localStorage.setItem("editLangIsoCode", lang.isoCode.toString());
    this.router.navigate(['edit-lang']);
  };

  addLang(): void {
    this.router.navigate(['add-lang']);
  };

  home(): void {
    this.router.navigate(['home']);
  };
}
