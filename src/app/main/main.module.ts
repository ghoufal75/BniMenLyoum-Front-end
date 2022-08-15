import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserGeoportailComponent } from "./user-geoportail/user-geoportail.component";
import { MainRoutingModule } from "./main.routing-module";
import { SharedModule } from "../shared/shared.module";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MainService } from "./main.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationService } from "./auth.service";
import { AuthUserInterceptor } from "./AuthUser.interceptor";

@NgModule({
  declarations: [UserGeoportailComponent, LandingPageComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    MainService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthUserInterceptor, multi: true },
  ],
})
export class MainModule {}
