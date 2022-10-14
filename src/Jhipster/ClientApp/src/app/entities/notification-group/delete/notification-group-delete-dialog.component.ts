import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { INotificationGroup } from "../notification-group.model";
import { NotificationGroupService } from "../service/notification-group.service";

@Component({
  templateUrl: "./notification-group-delete-dialog.component.html",
})
export class NotificationGroupDeleteDialogComponent {
  notificationGroup?: INotificationGroup;

  constructor(
    protected notificationGroupService: NotificationGroupService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notificationGroupService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
