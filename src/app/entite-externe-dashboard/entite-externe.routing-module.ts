import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EntiteExterneDashboardComponent } from "./entite-externe-dashboard.component";



const routes:Routes=[
  {path : '',component:EntiteExterneDashboardComponent}
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports : [RouterModule],
})
export class EntiteExterneDashboardRoutingModule{

}
