import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { ILogTemperature } from "../log-temperature.model";
import { LogTemperatureService } from "../service/log-temperature.service";

@Component({
  templateUrl: "./log-temperature-delete-dialog.component.html",
})
export class LogTemperatureDeleteDialogComponent {
  logTemperature?: ILogTemperature;

  constructor(
    protected logTemperatureService: LogTemperatureService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.logTemperatureService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
