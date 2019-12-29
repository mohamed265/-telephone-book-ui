import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKGovernorateId: ['', Validators.required]
    });


    this.apiService.getGovernorates()
      .subscribe(response => {
        var governorates = response['data'];
        governorates.forEach(governorate => {
          var sel = document.getElementById('LKGovernorateId');
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
    this.apiService.createCity(this.addForm.value)
      .subscribe(data => {
        debugger;
        if (data['status'] == 201) {
          alert('adding successfully');
          this.router.navigate(['list-city']);
        } else {
          alert("error");
          console.log(data);
        }
      }, err => {
        alert("error");
        console.log(err);
      });
  }

  back() {
    this.router.navigate(['list-city']);
  }

}
