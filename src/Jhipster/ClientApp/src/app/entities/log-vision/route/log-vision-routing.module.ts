import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { LogVisionComponent } from "../list/log-vision.component";
import { LogVisionDetailComponent } from "../detail/log-vision-detail.component";
import { LogVisionUpdateComponent } from "../update/log-vision-update.component";
import { LogVisionRoutingResolveService } from "./log-vision-routing-resolve.service";

const logVisionRoute: Routes = [
  {
    path: "",
    component: LogVisionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: LogVisionDetailComponent,
    resolve: {
      logVision: LogVisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: LogVisionUpdateComponent,
    resolve: {
      logVision: LogVisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: LogVisionUpdateComponent,
    resolve: {
      logVision: LogVisionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(logVisionRoute)],
  exports: [RouterModule],
})
export class LogVisionRoutingModule {}
