import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { INotificationGroup } from "../notification-group.model";
import { NotificationGroupService } from "../service/notification-group.service";
import { NotificationGroupDeleteDialogComponent } from "../delete/notification-group-delete-dialog.component";

@Component({
  selector: "jhi-notification-group",
  templateUrl: "./notification-group.component.html",
})
export class NotificationGroupComponent implements OnInit {
  notificationGroups?: INotificationGroup[];
  isLoading = false;

  constructor(
    protected notificationGroupService: NotificationGroupService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.notificationGroupService.query().subscribe({
      next: (res: HttpResponse<INotificationGroup[]>) => {
        this.isLoading = false;
        this.notificationGroups = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: INotificationGroup): number {
    return item.id!;
  }

  delete(notificationGroup: INotificationGroup): void {
    const modalRef = this.modalService.open(
      NotificationGroupDeleteDialogComponent,
      { size: "lg", backdrop: "static" }
    );
    modalRef.componentInstance.notificationGroup = notificationGroup;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
