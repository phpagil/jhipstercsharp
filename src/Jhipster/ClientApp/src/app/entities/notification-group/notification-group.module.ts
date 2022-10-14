import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { NotificationGroupComponent } from "./list/notification-group.component";
import { NotificationGroupDetailComponent } from "./detail/notification-group-detail.component";
import { NotificationGroupUpdateComponent } from "./update/notification-group-update.component";
import { NotificationGroupDeleteDialogComponent } from "./delete/notification-group-delete-dialog.component";
import { NotificationGroupRoutingModule } from "./route/notification-group-routing.module";

@NgModule({
  imports: [SharedModule, NotificationGroupRoutingModule],
  declarations: [
    NotificationGroupComponent,
    NotificationGroupDetailComponent,
    NotificationGroupUpdateComponent,
    NotificationGroupDeleteDialogComponent,
  ],
  entryComponents: [NotificationGroupDeleteDialogComponent],
})
export class NotificationGroupModule {}
