import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { AddUserComponent } from "./user/add-user/add-user.component";
import { ListUserComponent } from "./user/list-user/list-user.component";
import { EditUserComponent } from "./user/edit-user/edit-user.component";
import { AddLangComponent } from "./lang/add-lang/add-lang.component";
import { ListLangComponent } from "./lang/list-lang/list-lang.component";
import { EditLangComponent } from "./lang/edit-lang/edit-lang.component";
import { AddGovernorateComponent } from "./governorate/add-governorate/add-governorate.component";
import { ListGovernorateComponent } from "./governorate/list-governorate/list-governorate.component";
import { EditGovernorateComponent } from "./governorate/edit-governorate/edit-governorate.component";
import { AddCityComponent } from "./city/add-city/add-city.component";
import { ListCityComponent } from "./city/list-city/list-city.component";
import { EditCityComponent } from "./city/edit-city/edit-city.component";
import { AddAreaComponent } from "./area/add-area/add-area.component";
import { ListAreaComponent } from "./area/list-area/list-area.component";
import { EditAreaComponent } from "./area/edit-area/edit-area.component";
import { AddTagComponent } from "./tag/add-tag/add-tag.component";
import { ListTagComponent } from "./tag/list-tag/list-tag.component";
import { EditTagComponent } from "./tag/edit-tag/edit-tag.component";
import { AddContactComponent } from "./contact/add-contact/add-contact.component";
import { ListContactComponent } from "./contact/list-contact/list-contact.component";
import { EditContactComponent } from "./contact/edit-contact/edit-contact.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'list-user', component: ListUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'add-lang', component: AddLangComponent },
  { path: 'list-lang', component: ListLangComponent },
  { path: 'edit-lang', component: EditLangComponent },
  { path: 'add-governorate', component: AddGovernorateComponent },
  { path: 'list-governorate', component: ListGovernorateComponent },
  { path: 'edit-governorate', component: EditGovernorateComponent },
  { path: 'add-city', component: AddCityComponent },
  { path: 'list-city', component: ListCityComponent },
  { path: 'edit-city', component: EditCityComponent },
  { path: 'add-area', component: AddAreaComponent },
  { path: 'list-area', component: ListAreaComponent },
  { path: 'edit-area', component: EditAreaComponent },
  { path: 'add-tag', component: AddTagComponent },
  { path: 'list-tag', component: ListTagComponent },
  { path: 'edit-tag', component: EditTagComponent },
  { path: 'add-contact', component: AddContactComponent },
  { path: 'list-contact', component: ListContactComponent },
  { path: 'edit-contact', component: EditContactComponent },
  { path: '', component: LoginComponent }
];

export const routing = RouterModule.forRoot(routes);
