import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { DashboardComponent } from "../dashboard.component";

const dashboardRoute: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoute)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
