import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
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
import { tap } from 'rxjs';


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
    .pipe(tap(() => this.router.navigateByUrl('')))
    .subscribe();
  }

  signup({ email, password }: UserCredentials) {
    this.auth
    .signup(email, password)
    .pipe(tap(() => this.router.navigateByUrl('')))
    .subscribe();
  }

  resetPassword({ email }: UserCredentials) {
    this.auth
    .resetPassword(email)
    .pipe(tap(() => this.router.navigateByUrl('auth/login')))
    .subscribe();
  }

  navigateReset(){
    this.router.navigate([`/tabs/authentication/reset`])
  }
}

export interface UserCredentials {
  email: string;
  password: string;
}
