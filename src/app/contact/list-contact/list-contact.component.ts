import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../service/api.service"; 

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit {

  contacts: any[];
  allContacts: any[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getContacts()
      .subscribe(response => {
        this.allContacts = this.contacts = response['data'];
        for (let i = 0; i < this.contacts.length; i++) {
          this.contacts[i].number = this.contacts[i].number.split("$$", 1)[0];
        }
      });
  }

  deleteContact(contact): void {
    if (confirm('are you sure?'))
      this.apiService.deleteContact(contact.id)
        .subscribe(data => {
          this.contacts = this.contacts.filter(u => u !== contact);
        })
  };

  editContact(contact): void {
    window.localStorage.removeItem("editContactId");
    window.localStorage.setItem("editContactId", contact.id.toString());
    this.router.navigate(['edit-contact']);
  };

  addContact(): void {
    this.router.navigate(['add-contact']);
  };

  onChange(value: string) {
    console.log("the value is " + value);
    if (value == '') {
      this.contacts = this.allContacts;
    } else {
      this.contacts = [];
      for (let i = 0, j = 0; i < this.allContacts.length; i++) {
        if (this.allContacts[i].optout == value) {
          this.contacts.push(this.allContacts[i]);
        }
      }
    }
  }

  home(): void {
    this.router.navigate(['home']);
  };
}
