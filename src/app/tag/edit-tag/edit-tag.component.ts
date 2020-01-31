import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.css']
})
export class EditTagComponent implements OnInit {

  tag: any;
  tagId: any;
  LKTagId: any;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.tagId = window.localStorage.getItem("editTagId");

    if (!this.tagId) {
      alert("Invalid action.")
      this.router.navigate(['list-tag']);
      return;
    }

    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKTagId: ['', Validators.required]
    });

    this.apiService.getTagById(this.tagId)
      .subscribe(res => {
        let obj = {};
        let ar = res['data'].tagLocals.filter(function (local) { return local.LKLangIsoCode == 'ar'; });
        obj['arValue'] = ar && ar.length == 1 ? ar[0].value : "";
        let en = res['data'].tagLocals.filter(function (local) { return local.LKLangIsoCode == 'en'; });
        obj['enValue'] = en && en.length == 1 ? en[0].value : "";
        obj['name'] = res['data']['name'];
        obj['description'] = res['data']['description'];
        obj['id'] = res['data']['id'];
        this.LKTagId = obj['LKTagId'] = res['data']['LKTagId'];
        this.editForm.setValue(obj);
      });

    this.apiService.getTags()
      .subscribe(response => {
        var tags = response['data'];
        debugger;
        tags.forEach(tag => {
          var sel = document.getElementById('LKTagId');
          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(tag.name));

          // set value property of opt
          opt.value = tag.id;

          if (this.LKTagId && tag.id == this.LKTagId) {
            opt.selected = true;
          }

          // add opt to end of select box (sel)
          if (tag.id != this.tagId)
            sel.appendChild(opt);

        });
      });
  }

  back() {
    this.router.navigate(['list-tag']);
  }

  onSubmit() {
    let obj = this.editForm.value;
    obj.id = this.tagId;

    var sel = document.getElementById('LKTagId');
    var options = sel['options'];
    obj.LKTagId = sel['selectedIndex'] != -1 ? options[sel['selectedIndex']].value : null;
    debugger;
    this.apiService.updateTag(obj)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 201) {
            alert('tag updated successfully.');
            this.router.navigate(['list-tag']);
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
