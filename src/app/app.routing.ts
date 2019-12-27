import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from './home/home.component';
import { AddUserComponent } from "./user/add-user/add-user.component";
import { ListUserComponent } from "./user/list-user/list-user.component";
import { EditUserComponent } from "./user/edit-user/edit-user.component";
import { AddLangComponent } from "./lang/add-lang/add-lang.component";
import { ListLangComponent } from "./lang/list-lang/list-lang.component";
import { EditLangComponent } from "./lang/edit-lang/edit-lang.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'list-user', component: ListUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'add-lang', component: AddLangComponent },
  { path: 'list-lang', component: ListLangComponent },
  { path: 'edit-lang', component: EditLangComponent },
  { path: '', component: LoginComponent }
];

export const routing = RouterModule.forRoot(routes);
