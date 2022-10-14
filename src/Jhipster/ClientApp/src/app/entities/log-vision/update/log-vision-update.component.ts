import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import dayjs from "dayjs/esm";
import { DATE_TIME_FORMAT } from "app/config/input.constants";

import { ILogVision, LogVision } from "../log-vision.model";
import { LogVisionService } from "../service/log-vision.service";
import { IDevice } from "app/entities/device/device.model";
import { DeviceService } from "app/entities/device/service/device.service";
import { Status } from "app/entities/enumerations/status.model";

@Component({
  selector: "jhi-log-vision-update",
  templateUrl: "./log-vision-update.component.html",
})
export class LogVisionUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  devicesSharedCollection: IDevice[] = [];

  editForm = this.fb.group({
    id: [],
    createdAt: [],
    imagePath: [null, [Validators.maxLength(200)]],
    status: [],
    device: [null, Validators.required],
  });

  constructor(
    protected logVisionService: LogVisionService,
    protected deviceService: DeviceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ logVision }) => {
      if (logVision.id === undefined) {
        const today = dayjs().startOf("day");
        logVision.createdAt = today;
      }

      this.updateForm(logVision);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const logVision = this.createFromForm();
    if (logVision.id !== undefined) {
      this.subscribeToSaveResponse(this.logVisionService.update(logVision));
    } else {
      this.subscribeToSaveResponse(this.logVisionService.create(logVision));
    }
  }

  trackDeviceById(_index: number, item: IDevice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<ILogVision>>
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

  protected updateForm(logVision: ILogVision): void {
    this.editForm.patchValue({
      id: logVision.id,
      createdAt: logVision.createdAt
        ? logVision.createdAt.format(DATE_TIME_FORMAT)
        : null,
      imagePath: logVision.imagePath,
      status: logVision.status,
      device: logVision.device,
    });

    this.devicesSharedCollection =
      this.deviceService.addDeviceToCollectionIfMissing(
        this.devicesSharedCollection,
        logVision.device
      );
  }

  protected loadRelationshipsOptions(): void {
    this.deviceService
      .query()
      .pipe(map((res: HttpResponse<IDevice[]>) => res.body ?? []))
      .pipe(
        map((devices: IDevice[]) =>
          this.deviceService.addDeviceToCollectionIfMissing(
            devices,
            this.editForm.get("device")!.value
          )
        )
      )
      .subscribe(
        (devices: IDevice[]) => (this.devicesSharedCollection = devices)
      );
  }

  protected createFromForm(): ILogVision {
    return {
      ...new LogVision(),
      id: this.editForm.get(["id"])!.value,
      createdAt: this.editForm.get(["createdAt"])!.value
        ? dayjs(this.editForm.get(["createdAt"])!.value, DATE_TIME_FORMAT)
        : undefined,
      imagePath: this.editForm.get(["imagePath"])!.value,
      status: this.editForm.get(["status"])!.value,
      device: this.editForm.get(["device"])!.value,
    };
  }
}
