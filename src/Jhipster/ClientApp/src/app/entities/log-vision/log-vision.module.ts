import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { LogVisionComponent } from "./list/log-vision.component";
import { LogVisionDetailComponent } from "./detail/log-vision-detail.component";
import { LogVisionUpdateComponent } from "./update/log-vision-update.component";
import { LogVisionDeleteDialogComponent } from "./delete/log-vision-delete-dialog.component";
import { LogVisionRoutingModule } from "./route/log-vision-routing.module";

@NgModule({
  imports: [SharedModule, LogVisionRoutingModule],
  declarations: [
    LogVisionComponent,
    LogVisionDetailComponent,
    LogVisionUpdateComponent,
    LogVisionDeleteDialogComponent,
  ],
  entryComponents: [LogVisionDeleteDialogComponent],
})
export class LogVisionModule {}
