import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ILogVision } from "../log-vision.model";

@Component({
  selector: "jhi-log-vision-detail",
  templateUrl: "./log-vision-detail.component.html",
})
export class LogVisionDetailComponent implements OnInit {
  logVision: ILogVision | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ logVision }) => {
      this.logVision = logVision;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
