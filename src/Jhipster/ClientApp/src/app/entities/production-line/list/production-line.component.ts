import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IProductionLine } from "../production-line.model";
import { ProductionLineService } from "../service/production-line.service";
import { ProductionLineDeleteDialogComponent } from "../delete/production-line-delete-dialog.component";

@Component({
  selector: "jhi-production-line",
  templateUrl: "./production-line.component.html",
})
export class ProductionLineComponent implements OnInit {
  productionLines: IProductionLine[] = [{
    id: 0,
    description: ''
  }];
  isLoading = false;

  constructor(
    protected productionLineService: ProductionLineService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.productionLineService.query().subscribe({
      next: (res: HttpResponse<IProductionLine[]>) => {
        this.isLoading = false;
        this.productionLines = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IProductionLine): number {
    return item.id!;
  }

  delete(productionLine: IProductionLine): void {
    const modalRef = this.modalService.open(
      ProductionLineDeleteDialogComponent,
      { size: "lg", backdrop: "static" }
    );
    modalRef.componentInstance.productionLine = productionLine;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
