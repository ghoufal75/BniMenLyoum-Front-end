import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReclamationsComponent } from "./reclamations.component";

const routes: Routes = [{ path: "", component: ReclamationsComponent }];
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class ReclamationsRoutingModule{}
