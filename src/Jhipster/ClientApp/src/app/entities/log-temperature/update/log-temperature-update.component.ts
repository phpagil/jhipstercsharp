import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import dayjs from "dayjs/esm";
import { DATE_TIME_FORMAT } from "app/config/input.constants";

import { ILogTemperature, LogTemperature } from "../log-temperature.model";
import { LogTemperatureService } from "../service/log-temperature.service";
import { IDevice } from "app/entities/device/device.model";
import { DeviceService } from "app/entities/device/service/device.service";
import { Status } from "app/entities/enumerations/status.model";

@Component({
  selector: "jhi-log-temperature-update",
  templateUrl: "./log-temperature-update.component.html",
})
export class LogTemperatureUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  devicesSharedCollection: IDevice[] = [];

  editForm = this.fb.group({
    id: [],
    createdAt: [],
    temperature: [],
    status: [],
    device: [null, Validators.required],
  });

  constructor(
    protected logTemperatureService: LogTemperatureService,
    protected deviceService: DeviceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ logTemperature }) => {
      if (logTemperature.id === undefined) {
        const today = dayjs().startOf("day");
        logTemperature.createdAt = today;
      }

      this.updateForm(logTemperature);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const logTemperature = this.createFromForm();
    if (logTemperature.id !== undefined) {
      this.subscribeToSaveResponse(
        this.logTemperatureService.update(logTemperature)
      );
    } else {
      this.subscribeToSaveResponse(
        this.logTemperatureService.create(logTemperature)
      );
    }
  }

  trackDeviceById(_index: number, item: IDevice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<ILogTemperature>>
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

  protected updateForm(logTemperature: ILogTemperature): void {
    this.editForm.patchValue({
      id: logTemperature.id,
      createdAt: logTemperature.createdAt
        ? logTemperature.createdAt.format(DATE_TIME_FORMAT)
        : null,
      temperature: logTemperature.temperature,
      status: logTemperature.status,
      device: logTemperature.device,
    });

    this.devicesSharedCollection =
      this.deviceService.addDeviceToCollectionIfMissing(
        this.devicesSharedCollection,
        logTemperature.device
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

  protected createFromForm(): ILogTemperature {
    return {
      ...new LogTemperature(),
      id: this.editForm.get(["id"])!.value,
      createdAt: this.editForm.get(["createdAt"])!.value
        ? dayjs(this.editForm.get(["createdAt"])!.value, DATE_TIME_FORMAT)
        : undefined,
      temperature: this.editForm.get(["temperature"])!.value,
      status: this.editForm.get(["status"])!.value,
      device: this.editForm.get(["device"])!.value,
    };
  }
}
