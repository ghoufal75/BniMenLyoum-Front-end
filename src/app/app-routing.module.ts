import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { GeneralAuthGuard } from './account/auth/auth.guard';
import { EntiteExterneGuard } from './account/entiteExternce.guard';

const routes: Routes = [
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule) },
  {path : 'dashboardReclamations',loadChildren : ()=> import('./entite-externe-dashboard/entite-externe-dashboard.module').then(m=>m.EntiteExterneDashboardModule),canActivate:[EntiteExterneGuard]},
  { path: 'crypto-ico-landing', component: CyptolandingComponent },
  {path:'main',loadChildren:()=>import('./main/main.module').then(m=>m.MainModule)}, // tslint:disable-next-line: max-line-length
  { path: 'admin', component:LayoutComponent, children:[
    {path : '',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),canActivate:[GeneralAuthGuard] },
  ]
  },
  {path : '',redirectTo:'main',pathMatch:'full'},
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
