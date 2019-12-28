import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-list-area',
  templateUrl: './list-area.component.html',
  styleUrls: ['./list-area.component.css']
})
export class ListAreaComponent implements OnInit {

  areas: any[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getAreas()
      .subscribe(response => {
        this.areas = response['data'];
        this.areas.forEach(area => {
          let ar = area.areaLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
          area.arValue = ar && ar.length == 1 ? ar[0].value : "";
          let en = area.areaLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
          area.enValue = en && en.length == 1 ? en[0].value : "";
        });
      });
  }

  deleteArea(area): void {
    if (confirm('are you sure?'))
      this.apiService.deleteArea(area.id)
        .subscribe(data => {
          this.areas = this.areas.filter(u => u !== area);
        })
  };

  editArea(area): void {
    window.localStorage.removeItem("editAreaId");
    window.localStorage.setItem("editAreaId", area.id.toString());
    this.router.navigate(['edit-area']);
  };

  addArea(): void {
    this.router.navigate(['add-area']);
  };

  home(): void {
    this.router.navigate(['home']);
  };
}
