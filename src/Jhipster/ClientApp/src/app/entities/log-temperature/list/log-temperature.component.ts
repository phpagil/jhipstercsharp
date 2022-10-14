import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ILogTemperature } from "../log-temperature.model";
import { LogTemperatureService } from "../service/log-temperature.service";
import { LogTemperatureDeleteDialogComponent } from "../delete/log-temperature-delete-dialog.component";

@Component({
  selector: "jhi-log-temperature",
  templateUrl: "./log-temperature.component.html",
})
export class LogTemperatureComponent implements OnInit {
  logTemperatures?: ILogTemperature[];
  isLoading = false;

  constructor(
    protected logTemperatureService: LogTemperatureService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.logTemperatureService.query().subscribe({
      next: (res: HttpResponse<ILogTemperature[]>) => {
        this.isLoading = false;
        this.logTemperatures = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILogTemperature): number {
    return item.id!;
  }

  delete(logTemperature: ILogTemperature): void {
    const modalRef = this.modalService.open(
      LogTemperatureDeleteDialogComponent,
      { size: "lg", backdrop: "static" }
    );
    modalRef.componentInstance.logTemperature = logTemperature;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
