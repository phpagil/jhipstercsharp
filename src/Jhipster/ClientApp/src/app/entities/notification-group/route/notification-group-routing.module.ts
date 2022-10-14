import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { NotificationGroupComponent } from "../list/notification-group.component";
import { NotificationGroupDetailComponent } from "../detail/notification-group-detail.component";
import { NotificationGroupUpdateComponent } from "../update/notification-group-update.component";
import { NotificationGroupRoutingResolveService } from "./notification-group-routing-resolve.service";

const notificationGroupRoute: Routes = [
  {
    path: "",
    component: NotificationGroupComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: NotificationGroupDetailComponent,
    resolve: {
      notificationGroup: NotificationGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: NotificationGroupUpdateComponent,
    resolve: {
      notificationGroup: NotificationGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: NotificationGroupUpdateComponent,
    resolve: {
      notificationGroup: NotificationGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(notificationGroupRoute)],
  exports: [RouterModule],
})
export class NotificationGroupRoutingModule {}
