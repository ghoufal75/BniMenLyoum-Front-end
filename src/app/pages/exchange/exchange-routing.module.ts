import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ExchangeComponent } from "./exchange.component";


const routes:Routes=[
{path : "", component:ExchangeComponent}
];
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule],

})
export class ExchangeRoutingModule{

}
