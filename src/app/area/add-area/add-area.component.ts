import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.css']
})
export class AddAreaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKCityId: ['', Validators.required]
    });


    this.apiService.getCitys()
      .subscribe(response => {
        var governorates = response['data'];
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKCityId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(governorate.name));

          // set value property of opt
          opt.value = governorate.id;

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });
  }


  onSubmit() {
    debugger;
    this.apiService.createArea(this.addForm.value)
      .subscribe(data => {
        debugger;
        if (data['status'] == 201) {
          alert('adding successfully');
        } else {
          alert(data['errors'] ? data['errors'] : data);
        }
        this.router.navigate(['list-area']);
      }, err => {
        debugger;
        alert(err['error']['errors'][0].error ? err['error']['errors'][0].error : err);
        console.log(err)
      });
  }

  back() {
    this.router.navigate(['list-area']);
  }

}
