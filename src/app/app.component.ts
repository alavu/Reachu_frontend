import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageService } from './auth/services/user-stoarge.service';
import {NotificationService} from "./client/services/NotificationService";

@Component({
  selector: 'app-root',
  template:`
    <app-header/>
    <router-outlet/>
  `
})
export class AppComponent implements OnInit{
  title = 'ServiceBookingSystemWeb';

  isClientLoggedIn: boolean = UserStorageService.isUserLoggedIn();
  isCompanyLoggedIn: boolean = UserStorageService.isAdminLoggedIn();
  isPartnerLoggedIn: boolean = UserStorageService.isPartnerLoggedIn();
  // isGoogleLogin: boolean = UserStorageService.isGoogleLogin();

  constructor(private router: Router,
              private  notificationService: NotificationService){}

  ngOnInit(){
    this.router.events.subscribe(event =>{
        this.notificationService.requestPermission();
      this.isClientLoggedIn = UserStorageService.isUserLoggedIn();
      this.isCompanyLoggedIn = UserStorageService.isAdminLoggedIn();
      this.isPartnerLoggedIn = UserStorageService.isPartnerLoggedIn();
      // this.isGoogleLogin = UserStorageService.isGoogleLogin();
    })
  }

  logout(){
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }
}
