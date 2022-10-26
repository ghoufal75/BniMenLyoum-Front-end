import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssilahPageComponent } from "./assilah-page/assilah-page.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { UserGeoportailComponent } from "./user-geoportail/user-geoportail.component";

const routes: Routes = [
  { path: "geoportail", component: UserGeoportailComponent },
  { path: "landingPage", component: LandingPageComponent },
  {path:'assilahGeoPortail',component:AssilahPageComponent},
  { path: "", redirectTo: "assilahGeoPortail", pathMatch: "full" },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
