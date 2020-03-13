import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      arValue: ['', Validators.required],
      enValue: ['', Validators.required],
      LKTagId: ['', Validators.required],
      image: ['', Validators.required],
      sponsoredBy: ['', Validators.required],
    });


    this.apiService.getTags()
      .subscribe(response => {
        var tags = response['data'];
        tags.forEach(tag => {
          var sel = document.getElementById('LKTagId');

          // create new option element
          var opt = document.createElement('option');

          // create text node to add to option element (opt)
          opt.appendChild(document.createTextNode(tag.name));

          // set value property of opt
          opt.value = tag.id;

          // add opt to end of select box (sel)
          sel.appendChild(opt);

        });
      });
  }

  onSubmit() {
    debugger;
    if (!this.addForm.value.LKTagId)
      this.addForm.value.LKTagId = undefined;
    if (this.addForm.value.LKTagId == 'No Parent Tag')
      this.addForm.value.LKTagId = undefined;
    this.apiService.createTag(this.addForm.value)
      .subscribe(data => {
        debugger;
        if (data['status'] == 201) {
          alert('adding successfully');
          this.router.navigate(['list-tag']);
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
    this.router.navigate(['list-tag']);
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
          self.addForm.value.image = self.clientIcon = data;
          self.clientIconUploader.nativeElement.style.width = "75%"
        });
      }
    }
  }

  public removeClientIcon() {
    this.clientIconInvalidText = false;
    this.clientIcon = "";
    this.addForm.value.image = "";
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
