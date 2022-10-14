import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IFeatures } from "../features.model";
import { FeaturesService } from "../service/features.service";
import { FeaturesDeleteDialogComponent } from "../delete/features-delete-dialog.component";

@Component({
  selector: "jhi-features",
  templateUrl: "./features.component.html",
})
export class FeaturesComponent implements OnInit {
  features?: IFeatures[];
  isLoading = false;

  constructor(
    protected featuresService: FeaturesService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.featuresService.query().subscribe({
      next: (res: HttpResponse<IFeatures[]>) => {
        this.isLoading = false;
        this.features = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFeatures): number {
    return item.id!;
  }

  delete(features: IFeatures): void {
    const modalRef = this.modalService.open(FeaturesDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.features = features;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
