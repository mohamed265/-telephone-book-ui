import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.css']
})
export class EditAreaComponent implements OnInit {

  area: any;
  areaId: any;
  LKCityId: any;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.areaId = window.localStorage.getItem("editAreaId");

    if (!this.areaId) {
      alert("Invalid action.")
      this.router.navigate(['list-area']);
      return;
    }

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKCityId: ['', Validators.required]
    });

    this.apiService.getAreaById(this.areaId)
      .subscribe(res => {
        let obj = {};
        let ar = res['data'].areaLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
        obj['arValue'] = ar && ar.length == 1 ? ar[0].value : "";
        let en = res['data'].areaLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
        obj['enValue'] = en && en.length == 1 ? en[0].value : "";
        obj['name'] = res['data']['name'];
        obj['id'] = res['data']['id'];
        this.LKCityId = obj['LKCityId'] = res['data']['LKCityId'];
        this.editForm.setValue(obj);
      });

    this.apiService.getCitys()
      .subscribe(response => {
        var governorates = response['data'];
        debugger;
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKCityId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(governorate.name));

          // set value property of opt
          opt.value = governorate.id;

          if (this.LKCityId && governorate.id == this.LKCityId) {
            opt.selected = true;
          }

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });
  }

  back() {
    this.router.navigate(['list-area']);
  }

  onSubmit() {
    let obj = this.editForm.value;
    obj.id = this.areaId;

    var sel = document.getElementById('LKCityId');
    var options = sel['options'];
    obj.LKCityId = options[sel['selectedIndex']].value;
    debugger;
    this.apiService.updateArea(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 201) {
            alert('area updated successfully.');
            this.router.navigate(['list-area']);
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
