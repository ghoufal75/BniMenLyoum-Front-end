import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { AccountService } from './account.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoginResponsableComponent } from './login-responsable/login-responsable.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent, Recoverpwd2Component, LoginResponsableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    UIModule,
    AuthRoutingModule,
    CarouselModule
  ],
  providers:[]
})
export class AuthModule { }
