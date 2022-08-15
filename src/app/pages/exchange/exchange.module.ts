import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExchangeComponent } from "./exchange.component";
import { ExchangeRoutingModule } from "./exchange-routing.module";
import { Ng2CompleterModule } from "ng2-completer";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ExchangeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    ExchangeRoutingModule,

  ],
})
export class ExchangeModule {}
