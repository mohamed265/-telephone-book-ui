import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-list-governorate',
  templateUrl: './list-governorate.component.html',
  styleUrls: ['./list-governorate.component.css']
})
export class ListGovernorateComponent implements OnInit {

  governorates: any[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getGovernorates()
      .subscribe(response => {
        this.governorates = response['data'];
        this.governorates.forEach(governorate => {
          let ar = governorate.governorateLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
          governorate.arValue = ar && ar.length == 1 ? ar[0].value : "";
          let en = governorate.governorateLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
          governorate.enValue = en && en.length == 1 ? en[0].value : "";
        });
      });
  }

  deleteGovernorate(governorate): void {
    if (confirm('are you sure?'))
      this.apiService.deleteGovernorate(governorate.id)
        .subscribe(data => {
          this.governorates = this.governorates.filter(u => u !== governorate);
        })
  };

  editGovernorate(governorate): void {
    window.localStorage.removeItem("editGovernorateId");
    window.localStorage.setItem("editGovernorateId", governorate.id.toString());
    this.router.navigate(['edit-governorate']);
  };

  addGovernorate(): void {
    this.router.navigate(['add-governorate']);
  };

  home(): void {
    this.router.navigate(['home']);
  };
}
