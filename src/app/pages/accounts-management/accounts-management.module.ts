import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountsManagementComponent } from "./accounts-management.component";
import { AccountsManagementRouterModule } from "./accounts-management-router.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AccountsService } from "./accounts.service";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthInterceptor } from "src/app/account/auth/auth.interceptor";

@NgModule({
  declarations: [AccountsManagementComponent],
  imports: [
    CommonModule,
    AccountsManagementRouterModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    AccountsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AccountsManagementModule {}
