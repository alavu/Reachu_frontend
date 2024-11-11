import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ConnectedPartners} from "../../model/ConnectedPartners";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment";

const BASIC_URL = environment.apiBaseUrl;


@Injectable({
  providedIn: 'root'
})
export class PartnerChatService {

  constructor(private http: HttpClient) { }

    getConnectedUsers(partnerId: number): Observable<ConnectedPartners[]> {
        console.log("Connected users detail:",)
        return this.http.get<any>(`${BASIC_URL}/api/connections/users/${partnerId}`);
    }
}
