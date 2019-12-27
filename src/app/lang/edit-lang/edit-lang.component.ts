import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-lang',
  templateUrl: './edit-lang.component.html',
  styleUrls: ['./edit-lang.component.css']
})
export class EditLangComponent implements OnInit {

  lang: any;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    let langId = window.localStorage.getItem("editLangIsoCode");
    if (!langId) {
      alert("Invalid action.")
      this.router.navigate(['list-lang']);
      return;
    }
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      isoCode: ['', Validators.required]
    });
    this.apiService.getLangByIsoCode(langId)
      .subscribe(res => {
        this.editForm.setValue(res['data']);
      });
  }

  back() {
    this.router.navigate(['list-lang']);
  }

  onSubmit() {
    debugger;
    this.apiService.updateLang(this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 200) {
            alert('lang updated successfully.');
            this.router.navigate(['list-lang']);
          } else {
            alert(data['errors'] ? data['errors'] : data);
          }
        },
        error => {
          alert(error);
        });
  }
}
