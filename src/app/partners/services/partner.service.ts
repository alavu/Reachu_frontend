import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Partner } from 'src/app/model/partner.model';
import {environment} from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

 // Fetch partner details by ID
 getPartnerById(id: number): Observable<Partner> {
  return this.http.get<Partner>(`${this.apiUrl}/api/partners/${id}`);
  }

    updatePartner(partnerId: string, partnerData: FormData) {
      return this.http.put(`${this.apiUrl}/api/partners/${partnerId}`, partnerData, {
      });
    }

    getDashboardStats(partnerId: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/partners/${partnerId}/stats`);
    }

    getGraphData(partnerId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/api/partners/${partnerId}/graph-data`);
    }

      // Error handling function
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

    getWeeklyRevenue(partnerId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/partners/${partnerId}/weekly-revenue`);
    }

// Fetch monthly revenue for the partner
    getMonthlyRevenue(partnerId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/partners/${partnerId}/monthly-revenue`);
    }

// Fetch yearly revenue for the partner
    getYearlyRevenue(partnerId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/partners/${partnerId}/yearly-revenue`);
    }

// Fetch custom range revenue for the partner
    getCustomRangeRevenue(partnerId: number, startDate: Date, endDate: Date): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/api/partners/${partnerId}/custom-range-revenue?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
        );
    }


}
