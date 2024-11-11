import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { Address } from "src/app/company/model/Address";
import {environment} from "../../environment";

const BASIC_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class AddressServiceService {
  constructor(private http: HttpClient) {}

  getAddresses(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${BASIC_URL}/api/addresses?userId=${userId}`);
  }

  addAddress(address: Address): Observable<Address> {
    const url = `${BASIC_URL}/api/addresses`;
    return this.http.post<Address>(url, address, { observe: 'response' }).pipe(
      map(response => {
        console.log('Raw response:', response);
        if (response.body) {
          return response.body;
        } else {
          throw new Error('No address returned from server');
        }
      }),
      catchError(error => {
        console.error('Error occurred while adding address:', error);
        return throwError(() => new Error('Failed to add address'));
      })
    );
  }


  updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${BASIC_URL}/api/addresses/${id}`, address);
  }

  deleteAddress(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}/api/addresses/${id}?userId=${userId}`);
  }
}

