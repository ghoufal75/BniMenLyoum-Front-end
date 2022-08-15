import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountsManagementComponent } from "./accounts-management.component";

const routes: Routes = [
  { path: "", component: AccountsManagementComponent },
  // { path: "", redirectTo: "accountsManagement", pathMatch: "full" },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsManagementRouterModule {}
