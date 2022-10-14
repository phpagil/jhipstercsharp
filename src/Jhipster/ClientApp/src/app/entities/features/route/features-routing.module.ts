import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { FeaturesComponent } from "../list/features.component";
import { FeaturesDetailComponent } from "../detail/features-detail.component";
import { FeaturesUpdateComponent } from "../update/features-update.component";
import { FeaturesRoutingResolveService } from "./features-routing-resolve.service";

const featuresRoute: Routes = [
  {
    path: "",
    component: FeaturesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: FeaturesDetailComponent,
    resolve: {
      features: FeaturesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: FeaturesUpdateComponent,
    resolve: {
      features: FeaturesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: FeaturesUpdateComponent,
    resolve: {
      features: FeaturesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(featuresRoute)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
