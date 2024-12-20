import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from 'src/app/auth/services/user-stoarge.service';
import {environment} from "../../environment";

const BASIC_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  postAd(adDTO:any): Observable<any>{
    const userId = UserStorageService.getUserId();
    return this.http.post(BASIC_URL + `/api/company/ad/${userId}`, adDTO, {
      headers : this.createAuthorizationHeader()
    })
  }

  getAllAdsByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `/api/company/ads/${userId}`, {
      headers : this.createAuthorizationHeader()
    })
  }

  getAdById(adId:any): Observable<any>{
    return this.http.get(BASIC_URL + `/api/company/ad/${adId}`, {
      headers : this.createAuthorizationHeader()
    })
  }

  updateAd(adId:any, adDTO:any): Observable<any>{
    return this.http.put(BASIC_URL + `/api/company/ad/${adId}`, adDTO, {
      headers : this.createAuthorizationHeader()
    })
  }

  deletedAd(adId:any): Observable<any>{
    return this.http.delete(BASIC_URL + `/api/company/ad/${adId}`, {
      headers : this.createAuthorizationHeader()
    })
  }

  getAllAdBookings(): Observable<any>{
    const companyId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `/api/company/bookings/${companyId}`, {
      headers : this.createAuthorizationHeader()
    })
  }

  changeBookingStatus(bookingId: number, status: string): Observable<any>{

    return this.http.get(BASIC_URL + `/api/company/booking/${bookingId}/${status}`, {
      headers : this.createAuthorizationHeader()
    })
  }

addCategory(categoryDto:any): Observable<any> {
      return this.http.post(BASIC_URL + '/api/company/category', categoryDto,{
          headers: this.createAuthorizationHeader()
      })
}

    getAllCategories(): Observable<any> {
        return this.http.get(BASIC_URL + '/api/company',{
            headers: this.createAuthorizationHeader()
        })
    }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    )
  }
}
