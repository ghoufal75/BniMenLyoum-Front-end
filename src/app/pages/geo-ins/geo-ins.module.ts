import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GeoInsComponent } from "./geo-ins.component";
import { GeoInsRoutingModule } from "./geo-ins.routing.module";
import { MaitreOuvrageComponent } from "./maitre-ouvrage/maitre-ouvrage.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { GeoInsService } from "./geo-ins.service";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module"
import { Ng2CompleterModule } from "ng2-completer";
import { AccountService } from "src/app/account/auth/account.service";
import { AuthInterceptor } from "src/app/account/auth/auth.interceptor";

@NgModule({
  declarations: [GeoInsComponent,MaitreOuvrageComponent],
  imports: [CommonModule, GeoInsRoutingModule,HttpClientModule,NgbDropdownModule,FormsModule,SharedModule,Ng2CompleterModule,ReactiveFormsModule],
  providers:[GeoInsService,{provide : HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}]
})
export class GeoInsModule {}
