import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UIModule } from "./ui/ui.module";

import { WidgetModule } from "./widget/widget.module";
import { GeoportailComponent } from "./geoportail/geoportail.component";
import { GeoColService } from "./geoportail/geocol.service";
import { MapService } from "./geoportail/map.services";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapLoaderComponent } from "./map-loader/map-loader.component";
import { AuthInterceptor } from "../account/auth/auth.interceptor";
// import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [GeoportailComponent, MapLoaderComponent],
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    UIModule,
    // FlexLayoutModule
  ],
  exports: [GeoportailComponent, MapLoaderComponent],
  providers: [
    MapService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class SharedModule {}
