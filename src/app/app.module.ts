import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';

import { ListLangComponent } from './lang/list-lang/list-lang.component';
import { AddLangComponent } from './lang/add-lang/add-lang.component';
import { EditLangComponent } from './lang/edit-lang/edit-lang.component';

import { ListGovernorateComponent } from './governorate/list-governorate/list-governorate.component';
import { AddGovernorateComponent } from './governorate/add-governorate/add-governorate.component';
import { EditGovernorateComponent } from './governorate/edit-governorate/edit-governorate.component';

import { ListCityComponent } from './city/list-city/list-city.component';
import { AddCityComponent } from './city/add-city/add-city.component';
import { EditCityComponent } from './city/edit-city/edit-city.component';

import { AddAreaComponent } from "./area/add-area/add-area.component";
import { ListAreaComponent } from "./area/list-area/list-area.component";
import { EditAreaComponent } from "./area/edit-area/edit-area.component";

import { AddTagComponent } from "./tag/add-tag/add-tag.component";
import { ListTagComponent } from "./tag/list-tag/list-tag.component";
import { EditTagComponent } from "./tag/edit-tag/edit-tag.component";

import { routing } from "./app.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { ApiService } from "./service/api.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from "./core/interceptor";
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ListUserComponent,
    AddUserComponent,
    EditUserComponent,
    ListLangComponent,
    AddLangComponent,
    EditLangComponent,
    ListLangComponent,
    AddLangComponent,
    EditLangComponent,
    ListGovernorateComponent,
    AddGovernorateComponent,
    EditGovernorateComponent,
    ListCityComponent,
    AddCityComponent,
    EditCityComponent,
    ListAreaComponent,
    AddAreaComponent,
    EditAreaComponent,
    ListTagComponent,
    AddTagComponent,
    EditTagComponent
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ApiService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
