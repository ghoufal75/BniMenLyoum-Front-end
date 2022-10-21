import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReclamationsComponent } from "./reclamations.component";
import { ReclamationsRoutingModule } from "./reclamations.routing-module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "src/app/account/auth/auth.interceptor";

@NgModule({
  declarations: [ReclamationsComponent],
  imports: [CommonModule, ReclamationsRoutingModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class ReclamationsModule {}
