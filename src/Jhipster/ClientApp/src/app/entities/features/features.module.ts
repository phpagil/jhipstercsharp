import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { FeaturesComponent } from "./list/features.component";
import { FeaturesDetailComponent } from "./detail/features-detail.component";
import { FeaturesUpdateComponent } from "./update/features-update.component";
import { FeaturesDeleteDialogComponent } from "./delete/features-delete-dialog.component";
import { FeaturesRoutingModule } from "./route/features-routing.module";

@NgModule({
  imports: [SharedModule, FeaturesRoutingModule],
  declarations: [
    FeaturesComponent,
    FeaturesDetailComponent,
    FeaturesUpdateComponent,
    FeaturesDeleteDialogComponent,
  ],
  entryComponents: [FeaturesDeleteDialogComponent],
})
export class FeaturesModule {}
