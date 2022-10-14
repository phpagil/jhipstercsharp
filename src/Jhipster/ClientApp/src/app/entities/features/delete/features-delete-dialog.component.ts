import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IFeatures } from "../features.model";
import { FeaturesService } from "../service/features.service";

@Component({
  templateUrl: "./features-delete-dialog.component.html",
})
export class FeaturesDeleteDialogComponent {
  features?: IFeatures;

  constructor(
    protected featuresService: FeaturesService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.featuresService.delete(id).subscribe(() => {
      this.activeModal.close("deleted");
    });
  }
}
