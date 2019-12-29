import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-governorate',
  templateUrl: './edit-governorate.component.html',
  styleUrls: ['./edit-governorate.component.css']
})
export class EditGovernorateComponent implements OnInit {

  governorate: any;
  governorateId: any;
  langs: [];
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.governorateId = window.localStorage.getItem("editGovernorateId");

    if (!this.governorateId) {
      alert("Invalid action.")
      this.router.navigate(['list-governorate']);
      return;
    }

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required]
    });

    this.apiService.getGovernorateById(this.governorateId)
      .subscribe(res => {
        let obj = {};
        let ar = res['data'].governorateLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
        obj['arValue'] = ar && ar.length == 1 ? ar[0].value : "";
        let en = res['data'].governorateLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
        obj['enValue'] = en && en.length == 1 ? en[0].value : "";
        obj['name'] = res['data']['name'];
        obj['id'] = res['data']['id'];
        this.editForm.setValue(obj);
      });

    // this.apiService.getLangs()
    //   .subscribe(response => {
    //     this.langs = response['data'];
    //   });
  }

  back() {
    this.router.navigate(['list-governorate']);
  }

  onSubmit() {
    let obj = this.editForm.value;
    obj.id = this.governorateId;
    this.apiService.updateGovernorate(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 201) {
            alert('governorate updated successfully.');
            this.router.navigate(['list-governorate']);
          } else {
            alert("error");
            console.log(data);
          }
        },
        error => {
          alert("error");
          console.log(error);
        });
  }
}
