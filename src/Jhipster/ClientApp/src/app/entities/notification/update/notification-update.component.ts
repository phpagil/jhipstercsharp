import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { INotification, Notification } from "../notification.model";
import { NotificationService } from "../service/notification.service";
import { INotificationGroup } from "app/entities/notification-group/notification-group.model";
import { NotificationGroupService } from "app/entities/notification-group/service/notification-group.service";

@Component({
  selector: "jhi-notification-update",
  templateUrl: "./notification-update.component.html",
})
export class NotificationUpdateComponent implements OnInit {
  isSaving = false;

  notificationGroupsSharedCollection: INotificationGroup[] = [];

  editForm = this.fb.group({
    id: [],
    message: [null, [Validators.maxLength(45)]],
    statusReady: [],
    statusSent: [],
    notificationGroup: [null, Validators.required],
  });

  constructor(
    protected notificationService: NotificationService,
    protected notificationGroupService: NotificationGroupService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notification }) => {
      this.updateForm(notification);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notification = this.createFromForm();
    if (notification.id !== undefined) {
      this.subscribeToSaveResponse(
        this.notificationService.update(notification)
      );
    } else {
      this.subscribeToSaveResponse(
        this.notificationService.create(notification)
      );
    }
  }

  trackNotificationGroupById(_index: number, item: INotificationGroup): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<INotification>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(notification: INotification): void {
    this.editForm.patchValue({
      id: notification.id,
      message: notification.message,
      statusReady: notification.statusReady,
      statusSent: notification.statusSent,
      notificationGroup: notification.notificationGroup,
    });

    this.notificationGroupsSharedCollection =
      this.notificationGroupService.addNotificationGroupToCollectionIfMissing(
        this.notificationGroupsSharedCollection,
        notification.notificationGroup
      );
  }

  protected loadRelationshipsOptions(): void {
    this.notificationGroupService
      .query()
      .pipe(map((res: HttpResponse<INotificationGroup[]>) => res.body ?? []))
      .pipe(
        map((notificationGroups: INotificationGroup[]) =>
          this.notificationGroupService.addNotificationGroupToCollectionIfMissing(
            notificationGroups,
            this.editForm.get("notificationGroup")!.value
          )
        )
      )
      .subscribe(
        (notificationGroups: INotificationGroup[]) =>
          (this.notificationGroupsSharedCollection = notificationGroups)
      );
  }

  protected createFromForm(): INotification {
    return {
      ...new Notification(),
      id: this.editForm.get(["id"])!.value,
      message: this.editForm.get(["message"])!.value,
      statusReady: this.editForm.get(["statusReady"])!.value,
      statusSent: this.editForm.get(["statusSent"])!.value,
      notificationGroup: this.editForm.get(["notificationGroup"])!.value,
    };
  }
}
