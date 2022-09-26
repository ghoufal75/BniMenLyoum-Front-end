import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';


import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';

import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';
import { LoginResponsableComponent } from './login-responsable/login-responsable.component';
import { LoginEntiteExterneComponent } from './login-entite-externe/login-entite-externe.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
     path : 'loginResponsable',
     component:LoginResponsableComponent,
    },
    {
      path : 'loginEntiteExterne',
      component:LoginEntiteExterneComponent,
     },

    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
    {
        path: 'recoverpwd-2',
        component: Recoverpwd2Component
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
