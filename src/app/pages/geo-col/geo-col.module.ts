import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoColComponent } from './geo-col.component';
import { GeoColRoutingModule } from './geo-col.routing';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    GeoColComponent
  ],
  imports: [
    CommonModule,
    GeoColRoutingModule,
    SharedModule
  ],
})
export class GeoColModule { }
