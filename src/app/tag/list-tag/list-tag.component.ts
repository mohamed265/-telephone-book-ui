import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-list-tag',
  templateUrl: './list-tag.component.html',
  styleUrls: ['./list-tag.component.css']
})
export class ListTagComponent implements OnInit {

  tags: any[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getTags()
      .subscribe(response => {
        this.tags = response['data'];
        this.tags.forEach(tag => {
          let ar = tag.tagLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
          tag.arValue = ar && ar.length == 1 ? ar[0].value : "";
          let en = tag.tagLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
          tag.enValue = en && en.length == 1 ? en[0].value : "";
        });
      });
  }

  deleteTag(tag): void {
    this.apiService.deleteTag(tag.id)
      .subscribe(data => {
        this.tags = this.tags.filter(u => u !== tag);
      })
  };

  editTag(tag): void {
    window.localStorage.removeItem("editTagId");
    window.localStorage.setItem("editTagId", tag.id.toString());
    this.router.navigate(['edit-tag']);
  };

  addTag(): void {
    this.router.navigate(['add-tag']);
  };

  home(): void {
    this.router.navigate(['home']);
  };
}
