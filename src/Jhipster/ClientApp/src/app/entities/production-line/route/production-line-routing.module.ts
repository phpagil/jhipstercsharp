import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { ProductionLineComponent } from "../list/production-line.component";
import { ProductionLineDetailComponent } from "../detail/production-line-detail.component";
import { ProductionLineUpdateComponent } from "../update/production-line-update.component";
import { ProductionLineRoutingResolveService } from "./production-line-routing-resolve.service";

const productionLineRoute: Routes = [
  {
    path: "",
    component: ProductionLineComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: ProductionLineDetailComponent,
    resolve: {
      productionLine: ProductionLineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: ProductionLineUpdateComponent,
    resolve: {
      productionLine: ProductionLineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: ProductionLineUpdateComponent,
    resolve: {
      productionLine: ProductionLineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productionLineRoute)],
  exports: [RouterModule],
})
export class ProductionLineRoutingModule {}
