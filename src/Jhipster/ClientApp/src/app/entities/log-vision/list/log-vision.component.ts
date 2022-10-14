import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ILogVision } from "../log-vision.model";
import { LogVisionService } from "../service/log-vision.service";
import { LogVisionDeleteDialogComponent } from "../delete/log-vision-delete-dialog.component";

@Component({
  selector: "jhi-log-vision",
  templateUrl: "./log-vision.component.html",
})
export class LogVisionComponent implements OnInit {
  logVisions?: ILogVision[];
  isLoading = false;

  constructor(
    protected logVisionService: LogVisionService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.logVisionService.query().subscribe({
      next: (res: HttpResponse<ILogVision[]>) => {
        this.isLoading = false;
        this.logVisions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILogVision): number {
    return item.id!;
  }

  delete(logVision: ILogVision): void {
    const modalRef = this.modalService.open(LogVisionDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.logVision = logVision;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
