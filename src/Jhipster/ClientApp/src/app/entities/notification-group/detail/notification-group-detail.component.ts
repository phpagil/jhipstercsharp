import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { INotificationGroup } from "../notification-group.model";

@Component({
  selector: "jhi-notification-group-detail",
  templateUrl: "./notification-group-detail.component.html",
})
export class NotificationGroupDetailComponent implements OnInit {
  notificationGroup: INotificationGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notificationGroup }) => {
      this.notificationGroup = notificationGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
