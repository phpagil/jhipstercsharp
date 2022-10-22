import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IDevice } from "../device.model";
import { DeviceService } from "../service/device.service";
import { DeviceDeleteDialogComponent } from "../delete/device-delete-dialog.component";

@Component({
  selector: "jhi-device",
  templateUrl: "./device.component.html",
})
export class DeviceComponent implements OnInit {
  devices?: IDevice[];
  isLoading = false;

  constructor(
    protected deviceService: DeviceService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.deviceService.query().subscribe({
      next: (res: HttpResponse<IDevice[]>) => {
        this.isLoading = false;
        this.devices = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDevice): number {
    return item.id!;
  }

  delete(device: IDevice): void {
    const modalRef = this.modalService.open(DeviceDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.device = device;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
