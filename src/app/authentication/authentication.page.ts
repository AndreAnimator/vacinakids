import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AuthenticationService } from './authentication';
import { Observable, tap } from 'rxjs';
import { Child } from './child.model';
import { VaccineService } from '../vaccine/vaccine';
import { Vaccine } from '../vaccine/vaccine.model';


@Component({
  selector: 'app-authentication',
  templateUrl: 'authentication.page.html',
  styleUrls: ['authentication.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    AuthFormComponent,
    RouterLink,
    ExploreContainerComponentModule,
    RouterModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class authenticationPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthenticationService);
  private vaccineService = inject(VaccineService);

  public availableVaccines: Observable<Vaccine[]>;
  isLoading = true;
  error: string | null = null;

  constructor(
  ) {
    this.availableVaccines = this.vaccineService.getVaccineList();
    console.log(this.availableVaccines)
  }

  readonly currentPage = this.router.url.split('/')[
    this.router.url.split('/').length - 1
  ] as 'login' | 'signup' | 'reset';

  readonly AUTH_PAGE_CONFIG = {
    login: {
      pageTitle: 'Sign In',
      actionButtonText: 'Sign In',
    },
    signup: {
      pageTitle: 'Create your account',
      actionButtonText: 'Create Account',
    },
    reset: {
      pageTitle: 'Reset your password',
      actionButtonText: 'Reset Password',
    },
  };

  readonly pageTitle = this.AUTH_PAGE_CONFIG[this.currentPage].pageTitle;
  readonly actionButtonText =
    this.AUTH_PAGE_CONFIG[this.currentPage].actionButtonText;
  
  handleUserCredentials(userCredentials: UserCredentials) {
    switch (this.currentPage) {
      case 'login':
        this.login(userCredentials);
        break;
      case 'signup':
        this.signup(userCredentials);
        break;
      case 'reset':
        this.resetPassword(userCredentials);
        break;
    }
  }

  login({ email, password }: UserCredentials) {
    this.auth
    .login(email, password)
    .pipe(tap(() => this.router.navigateByUrl('/tabs/vaccine')))
    .subscribe();
  }

  signup({ email, password, name, sons }: UserCredentials) {
    this.auth
    .signup(email, password, name, sons)
    .pipe(tap(() => this.router.navigateByUrl('')))
    .subscribe();
  }

  resetPassword({ email }: UserCredentials) {
    this.auth
    .resetPassword(email)
    .pipe(tap(() => this.router.navigateByUrl('/tabs/authentication/login')))
    .subscribe();
  }

  navigateReset(){
    this.router.navigate([`/tabs/authentication/reset`])
  }
}

export interface UserCredentials {
  name: string;
  email: string;
  password: string;
  sons: Child[];
}
