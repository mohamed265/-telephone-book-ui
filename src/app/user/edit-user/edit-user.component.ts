import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from "../../model/user.model";
import { ApiService } from "../../service/api.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }
  userId;
  ngOnInit() {
    this.userId = window.localStorage.getItem("editUserId");
    if (!this.userId) {
      alert("Invalid action.")
      this.router.navigate(['list-user']);
      return;
    }
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required]
    });
    this.apiService.getUserById(this.userId)
      .subscribe(res => {
        let obj = {};
        obj['email'] = res['data']['email'];
        obj['password'] = "";//res['data']['password'];
        obj['name'] = res['data']['name'];
        this.editForm.setValue(obj);
      });
  }

  onSubmit() {
    this.editForm.value['id'] = this.userId;
    this.apiService.updateUser(this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.status === 201) {
            alert('User updated successfully.');
            this.router.navigate(['list-user']);
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


  back() {
    this.router.navigate(['list-user']);
  }


}
