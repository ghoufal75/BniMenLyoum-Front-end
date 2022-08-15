import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GeoInsComponent } from "./geo-ins.component";
import { MaitreOuvrageComponent } from "./maitre-ouvrage/maitre-ouvrage.component";

const routes: Routes = [
  { path: "projets", component: GeoInsComponent },
  {path:"maitresOuvrage",component:MaitreOuvrageComponent}

];
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class GeoInsRoutingModule {}
