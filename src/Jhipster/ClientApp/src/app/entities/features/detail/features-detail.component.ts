import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IFeatures } from "../features.model";

@Component({
  selector: "jhi-features-detail",
  templateUrl: "./features-detail.component.html",
})
export class FeaturesDetailComponent implements OnInit {
  features: IFeatures | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ features }) => {
      this.features = features;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
