import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKTagId: ['', Validators.required],
      sponsoredBy: ['', Validators.required],
      image: ['', Validators.required],
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
        obj['sponsoredBy'] = res['data']['sponsoredBy'];
        obj['image'] = res['data']['image'];
        if(obj['image']){
          this.editForm.value.image = this.clientIcon = obj['image'];
          this.clientIconUploader.nativeElement.style.width = "75%"
        }
        obj['id'] = res['data']['id'];
        this.LKTagId = obj['LKTagId'] = res['data']['LKTagId'];
        this.editForm.setValue(obj);
        
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

      });


  }

  back() {
    this.router.navigate(['list-tag']);
  }

  onSubmit() {
    let obj = this.editForm.value;
    obj.id = this.tagId;

    let sel = document.getElementById('LKTagId');
    let options = sel['options'];
    obj.LKTagId = sel['selectedIndex'] != -1 ? (options[sel['selectedIndex']].value == -1 ? null : options[sel['selectedIndex']].value) : null;
    if (obj.LKTagId == 'No Parent Tag')
      obj.LKTagId = null;
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

  @ViewChild('clientIconUploader', { static: true }) clientIconUploader;

  clientIcon;
  clientIconInvalidText;

  public clientIconChangeEvent(fileInput) {
    let self = this;

    this.clientIconInvalidText = false;

    if (fileInput.target.files && fileInput.target.files[0]) {

      let file = fileInput.target.files[0];

      if (file.size > (100000 / 2)) {
        this.clientIconInvalidText = true;
      } else {
        this.getBase64(file).then(function (data) {
          self.editForm.value.image = self.clientIcon = data;
          self.clientIconUploader.nativeElement.style.width = "75%"
        });
      }
    }
  }

  public removeClientIcon() {
    this.clientIconInvalidText = false;
    this.clientIcon = "";
    this.editForm.value.image = "";
    this.clientIconUploader.nativeElement.value = null;
    this.clientIconUploader.nativeElement.style.width = "95%"
  }

  public getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
