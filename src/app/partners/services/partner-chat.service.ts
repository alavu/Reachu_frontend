import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from "rxjs";
import {ConnectedPartners} from "../../model/ConnectedPartners";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment";
import {User} from "../../model/User";

const BASIC_URL = environment.apiBaseUrl;


@Injectable({
  providedIn: 'root'
})
export class PartnerChatService {

  constructor(private http: HttpClient) { }

    // getConnectedUsers(partnerId: number): Observable<ConnectedPartners[]> {
    //     console.log("Connected users detail:",)
    //     return this.http.get<any>(`${BASIC_URL}/api/connections/users/${partnerId}`);
    // }

    getConnectedUsers(partnerId: number): Observable<User[]> {
        console.log('Fetching connected users for partnerId:', partnerId);
        return this.http.get<User[]>(`${BASIC_URL}/api/connections/users/${partnerId}`).pipe(
            map(response => {
                if (response === null) {
                    console.warn('Received null response for connected users.');
                    return [];
                }
                return response;
            }),
            catchError(error => {
                console.error('Error in getConnectedUsers:', error);
                return throwError(() => error);
            })
        );
    }
}
