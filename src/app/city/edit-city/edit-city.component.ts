import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {

  city: any;
  cityId: any;
  LKGovernorateId: any;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.cityId = window.localStorage.getItem("editCityId");

    if (!this.cityId) {
      alert("Invalid action.")
      this.router.navigate(['list-city']);
      return;
    }

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKGovernorateId: ['', Validators.required]
    });

    this.apiService.getCityById(this.cityId)
      .subscribe(res => {
        let obj = {};
        let ar = res['data'].cityLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
        obj['arValue'] = ar && ar.length == 1 ? ar[0].value : "";
        let en = res['data'].cityLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
        obj['enValue'] = en && en.length == 1 ? en[0].value : "";
        obj['name'] = res['data']['name'];
        obj['id'] = res['data']['id'];
        this.LKGovernorateId = obj['LKGovernorateId'] = res['data']['LKGovernorateId'];
        this.editForm.setValue(obj);
      });

    this.apiService.getGovernorates()
      .subscribe(response => {
        var governorates = response['data'];
        debugger;
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKGovernorateId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(governorate.name));

          // set value property of opt
          opt.value = governorate.id;

          if (this.LKGovernorateId && governorate.id == this.LKGovernorateId) {
            opt.selected = true;
          }

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });
  }

  back() {
    this.router.navigate(['list-city']);
  }

  onSubmit() {
    let obj = this.editForm.value;
    obj.id = this.cityId;
    this.apiService.updateCity(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 201) {
            alert('city updated successfully.');
            this.router.navigate(['list-city']);
          } else {
            alert(data['errors'] ? data['errors'] : data);
          }
        },
        error => {
          alert(error);
        });
  }
}
