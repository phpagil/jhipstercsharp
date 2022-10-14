import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { LogTemperatureComponent } from "../list/log-temperature.component";
import { LogTemperatureDetailComponent } from "../detail/log-temperature-detail.component";
import { LogTemperatureUpdateComponent } from "../update/log-temperature-update.component";
import { LogTemperatureRoutingResolveService } from "./log-temperature-routing-resolve.service";

const logTemperatureRoute: Routes = [
  {
    path: "",
    component: LogTemperatureComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: LogTemperatureDetailComponent,
    resolve: {
      logTemperature: LogTemperatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: LogTemperatureUpdateComponent,
    resolve: {
      logTemperature: LogTemperatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: LogTemperatureUpdateComponent,
    resolve: {
      logTemperature: LogTemperatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(logTemperatureRoute)],
  exports: [RouterModule],
})
export class LogTemperatureRoutingModule {}
