import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IDevice, Device } from "../device.model";
import { DeviceService } from "../service/device.service";
import { IProductionLine } from "app/entities/production-line/production-line.model";
import { ProductionLineService } from "app/entities/production-line/service/production-line.service";
import { INotificationGroup } from "app/entities/notification-group/notification-group.model";
import { NotificationGroupService } from "app/entities/notification-group/service/notification-group.service";
import { SensorType } from "app/entities/enumerations/sensor-type.model";

@Component({
  selector: "jhi-device-update",
  templateUrl: "./device-update.component.html",
})
export class DeviceUpdateComponent implements OnInit {
  isSaving = false;
  sensorTypeValues = Object.keys(SensorType);

  productionLinesSharedCollection: IProductionLine[] = [];
  notificationGroupsSharedCollection: INotificationGroup[] = [];

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.maxLength(45)]],
    sensorType: [],
    macAddress: [null, [Validators.maxLength(45)]],
    status: [],
    productionLine: [null, Validators.required],
    notificationGroup: [null, Validators.required],
  });

  constructor(
    protected deviceService: DeviceService,
    protected productionLineService: ProductionLineService,
    protected notificationGroupService: NotificationGroupService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ device }) => {
      this.updateForm(device);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const device = this.createFromForm();
    if (device.id !== undefined) {
      this.subscribeToSaveResponse(this.deviceService.update(device));
    } else {
      this.subscribeToSaveResponse(this.deviceService.create(device));
    }
  }

  trackProductionLineById(_index: number, item: IProductionLine): number {
    return item.id!;
  }

  trackNotificationGroupById(_index: number, item: INotificationGroup): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IDevice>>
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

  protected updateForm(device: IDevice): void {
    this.editForm.patchValue({
      id: device.id,
      description: device.description,
      sensorType: device.sensorType,
      macAddress: device.macAddress,
      status: device.status,
      productionLine: device.productionLine,
      notificationGroup: device.notificationGroup,
    });

    this.productionLinesSharedCollection =
      this.productionLineService.addProductionLineToCollectionIfMissing(
        this.productionLinesSharedCollection,
        device.productionLine
      );
    this.notificationGroupsSharedCollection =
      this.notificationGroupService.addNotificationGroupToCollectionIfMissing(
        this.notificationGroupsSharedCollection,
        device.notificationGroup
      );
  }

  protected loadRelationshipsOptions(): void {
    this.productionLineService
      .query()
      .pipe(map((res: HttpResponse<IProductionLine[]>) => res.body ?? []))
      .pipe(
        map((productionLines: IProductionLine[]) =>
          this.productionLineService.addProductionLineToCollectionIfMissing(
            productionLines,
            this.editForm.get("productionLine")!.value
          )
        )
      )
      .subscribe(
        (productionLines: IProductionLine[]) =>
          (this.productionLinesSharedCollection = productionLines)
      );

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

  protected createFromForm(): IDevice {
    return {
      ...new Device(),
      id: this.editForm.get(["id"])!.value,
      description: this.editForm.get(["description"])!.value,
      sensorType: this.editForm.get(["sensorType"])!.value,
      macAddress: this.editForm.get(["macAddress"])!.value,
      status: this.editForm.get(["status"])!.value,
      productionLine: this.editForm.get(["productionLine"])!.value,
      notificationGroup: this.editForm.get(["notificationGroup"])!.value,
    };
  }
}
