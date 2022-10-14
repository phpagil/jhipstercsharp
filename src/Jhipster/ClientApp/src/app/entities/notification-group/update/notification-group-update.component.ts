import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import {
  INotificationGroup,
  NotificationGroup,
} from "../notification-group.model";
import { NotificationGroupService } from "../service/notification-group.service";

@Component({
  selector: "jhi-notification-group-update",
  templateUrl: "./notification-group-update.component.html",
})
export class NotificationGroupUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.maxLength(45)]],
  });

  constructor(
    protected notificationGroupService: NotificationGroupService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notificationGroup }) => {
      this.updateForm(notificationGroup);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notificationGroup = this.createFromForm();
    if (notificationGroup.id !== undefined) {
      this.subscribeToSaveResponse(
        this.notificationGroupService.update(notificationGroup)
      );
    } else {
      this.subscribeToSaveResponse(
        this.notificationGroupService.create(notificationGroup)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<INotificationGroup>>
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

  protected updateForm(notificationGroup: INotificationGroup): void {
    this.editForm.patchValue({
      id: notificationGroup.id,
      description: notificationGroup.description,
    });
  }

  protected createFromForm(): INotificationGroup {
    return {
      ...new NotificationGroup(),
      id: this.editForm.get(["id"])!.value,
      description: this.editForm.get(["description"])!.value,
    };
  }
}
