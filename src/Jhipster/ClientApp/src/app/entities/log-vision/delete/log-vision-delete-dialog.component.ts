import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { ILogVision } from "../log-vision.model";
import { LogVisionService } from "../service/log-vision.service";

@Component({
  templateUrl: "./log-vision-delete-dialog.component.html",
})
export class LogVisionDeleteDialogComponent {
  logVision?: ILogVision;

  constructor(
    protected logVisionService: LogVisionService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.logVisionService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
