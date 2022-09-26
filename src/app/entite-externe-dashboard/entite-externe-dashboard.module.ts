import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntiteExterneDashboardComponent } from './entite-externe-dashboard.component';
import { EntiteExterneDashboardRoutingModule } from './entite-externe.routing-module';


@NgModule({
  declarations: [EntiteExterneDashboardComponent],
  imports: [
    CommonModule,
    EntiteExterneDashboardRoutingModule,
  ]
})
export class EntiteExterneDashboardModule { }
