import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-list-city',
  templateUrl: './list-city.component.html',
  styleUrls: ['./list-city.component.css']
})
export class ListCityComponent implements OnInit {

  citys: any[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getCitys()
      .subscribe(response => {
        this.citys = response['data'];
        this.citys.forEach(city => {
          let ar = city.cityLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
          city.arValue = ar && ar.length == 1 ? ar[0].value : "";
          let en = city.cityLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
          city.enValue = en && en.length == 1 ? en[0].value : "";
        });
      });
  }

  deleteCity(city): void {
    if (confirm('are you sure?'))
      this.apiService.deleteCity(city.id)
        .subscribe(data => {
          this.citys = this.citys.filter(u => u !== city);
        })
  };

  editCity(city): void {
    window.localStorage.removeItem("editCityId");
    window.localStorage.setItem("editCityId", city.id.toString());
    this.router.navigate(['edit-city']);
  };

  addCity(): void {
    this.router.navigate(['add-city']);
  };

  home(): void {
    this.router.navigate(['home']);
  };
}
