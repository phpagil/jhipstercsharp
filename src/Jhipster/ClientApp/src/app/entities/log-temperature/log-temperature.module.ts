import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { LogTemperatureComponent } from "./list/log-temperature.component";
import { LogTemperatureDetailComponent } from "./detail/log-temperature-detail.component";
import { LogTemperatureUpdateComponent } from "./update/log-temperature-update.component";
import { LogTemperatureDeleteDialogComponent } from "./delete/log-temperature-delete-dialog.component";
import { LogTemperatureRoutingModule } from "./route/log-temperature-routing.module";

@NgModule({
  imports: [SharedModule, LogTemperatureRoutingModule],
  declarations: [
    LogTemperatureComponent,
    LogTemperatureDetailComponent,
    LogTemperatureUpdateComponent,
    LogTemperatureDeleteDialogComponent,
  ],
  entryComponents: [LogTemperatureDeleteDialogComponent],
})
export class LogTemperatureModule {}
