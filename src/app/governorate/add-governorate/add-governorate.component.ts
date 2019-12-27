import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-add-governorate',
  templateUrl: './add-governorate.component.html',
  styleUrls: ['./add-governorate.component.css']
})
export class AddGovernorateComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required]
    });

  }

  onSubmit() {
    debugger;
    this.apiService.createGovernorate(this.addForm.value)
      .subscribe(data => {
        debugger;
        if (data['status'] == 201) {
          alert('adding successfully');
        } else {
          alert(data['errors'] ? data['errors'] : data);
        }
        this.router.navigate(['list-governorate']);
      }, err => {
        debugger;
        alert(err['error']['errors'][0].error ? err['error']['errors'][0].error : err);
        console.log(err)
      });
  }

  back() {
    this.router.navigate(['list-governorate']);
  }

}
