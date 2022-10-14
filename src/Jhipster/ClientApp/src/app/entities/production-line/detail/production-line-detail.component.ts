import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IProductionLine } from "../production-line.model";

@Component({
  selector: "jhi-production-line-detail",
  templateUrl: "./production-line-detail.component.html",
})
export class ProductionLineDetailComponent implements OnInit {
  productionLine: IProductionLine | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productionLine }) => {
      this.productionLine = productionLine;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
