import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ILogTemperature } from "../log-temperature.model";

@Component({
  selector: "jhi-log-temperature-detail",
  templateUrl: "./log-temperature-detail.component.html",
})
export class LogTemperatureDetailComponent implements OnInit {
  logTemperature: ILogTemperature | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ logTemperature }) => {
      this.logTemperature = logTemperature;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
