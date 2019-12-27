import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from "../model/user.model";
import { Observable } from "rxjs/index";
import { ApiResponse } from "../model/api.response";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://localhost:3000/v1/'

  login(loginPayload): Observable<ApiResponse> {
    console.log(loginPayload);
    return this.http.post<ApiResponse>('http://localhost:3000/v1/token/generate-token', loginPayload);
  }

  getUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'user/');
  }

  getUserById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'user/' + id);
  }

  createUser(user): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl + 'user/', user);
  }

  updateUser(user): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + 'user/' + user.id, user);
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + 'user/' + id);
  }

  ///////////////////////////// lang
  getLangs(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'lang/');
  }

  getLangByIsoCode(isoCode: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'lang/' + isoCode);
  }

  createLang(lang): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl + 'lang/', lang);
  }

  updateLang(lang): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(this.baseUrl + 'lang/' + lang.isoCode, lang);
  }

  deleteLang(isoCode: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + 'lang/' + isoCode);
  }

  ///////////////////////////// governorate
  getGovernorates(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'governorate/local');
  }

  getGovernorateById(isoCode: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'governorate/' + isoCode);
  }

  createGovernorate(governorate): Observable<ApiResponse> {
    governorate.governorateLocals = [
      {
        "LKLangIsoCode": "ar",
        "value": governorate.arValue
      },
      {
        "LKLangIsoCode": "en",
        "value": governorate.enValue
      }
    ];

    return this.http.post<ApiResponse>(this.baseUrl + 'governorate/', governorate);
  }

  updateGovernorate(governorate): Observable<ApiResponse> {
    governorate.governorateLocals = [
      {
        "LKLangIsoCode": "ar",
        "value": governorate.arValue
      },
      {
        "LKLangIsoCode": "en",
        "value": governorate.enValue
      }
    ];

    return this.http.patch<ApiResponse>(this.baseUrl + 'governorate/' + governorate.id + "/withLocals", governorate);
  }

  deleteGovernorate(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + 'governorate/' + id);
  }
  ///////////////////////////// city
  getCitys(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'city/local');
  }

  getCityById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'city/' + id);
  }

  createCity(city): Observable<ApiResponse> {
    city.cityLocals = [
      {
        "LKLangIsoCode": "ar",
        "value": city.arValue
      },
      {
        "LKLangIsoCode": "en",
        "value": city.enValue
      }
    ];

    return this.http.post<ApiResponse>(this.baseUrl + 'city/', city);
  }

  updateCity(city): Observable<ApiResponse> {
    city.cityLocals = [
      {
        "LKLangIsoCode": "ar",
        "value": city.arValue
      },
      {
        "LKLangIsoCode": "en",
        "value": city.enValue
      }
    ];

    return this.http.patch<ApiResponse>(this.baseUrl + 'city/' + city.id + "/withLocals", city);
  }

  deleteCity(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + 'city/' + id);
  }

  ///////////////////////////// area
  getAreas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'area/local');
  }

  getAreaById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'area/' + id);
  }

  createArea(area): Observable<ApiResponse> {
    area.areaLocals = [
      {
        "LKLangIsoCode": "ar",
        "value": area.arValue
      },
      {
        "LKLangIsoCode": "en",
        "value": area.enValue
      }
    ];

    return this.http.post<ApiResponse>(this.baseUrl + 'area/', area);
  }

  updateArea(area): Observable<ApiResponse> {
    area.areaLocals = [
      {
        "LKLangIsoCode": "ar",
        "value": area.arValue
      },
      {
        "LKLangIsoCode": "en",
        "value": area.enValue
      }
    ];

    return this.http.patch<ApiResponse>(this.baseUrl + 'area/' + area.id + "/withLocals", area);
  }

  deleteArea(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + 'area/' + id);
  }
}
