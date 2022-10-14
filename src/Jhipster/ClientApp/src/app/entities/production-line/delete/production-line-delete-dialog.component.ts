import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IProductionLine } from "../production-line.model";
import { ProductionLineService } from "../service/production-line.service";

@Component({
  templateUrl: "./production-line-delete-dialog.component.html",
})
export class ProductionLineDeleteDialogComponent {
  productionLine?: IProductionLine;

  constructor(
    protected productionLineService: ProductionLineService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productionLineService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
