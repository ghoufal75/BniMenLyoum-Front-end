import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationsComponent } from './reclamations.component';
import { ReclamationsRoutingModule } from './reclamations.routing-module';



@NgModule({
  declarations: [
    ReclamationsComponent
  ],
  imports: [
    CommonModule,
    ReclamationsRoutingModule
  ]
})
export class ReclamationsModule { }
