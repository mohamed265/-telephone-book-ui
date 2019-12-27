import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-add-lang',
  templateUrl: './add-lang.component.html',
  styleUrls: ['./add-lang.component.css']
})
export class AddLangComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      isoCode: ['', Validators.required],
    });

  }

  onSubmit() {
    this.apiService.createLang(this.addForm.value)
      .subscribe(data => {
        debugger;
        if (data['status'] == 200) {
          alert('adding successfully');
        } else {
          alert(data['errors'] ? data['errors'] : data);
        }
        this.router.navigate(['list-lang']);
      }, err => {
        debugger;
        alert(err['error']['errors'][0].error ? err['error']['errors'][0].error : err);
        console.log(err)
      });
  }

  back() {
    this.router.navigate(['list-lang']);
  }

}
