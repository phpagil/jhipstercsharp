import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { ProductionLineComponent } from "./list/production-line.component";
import { ProductionLineDetailComponent } from "./detail/production-line-detail.component";
import { ProductionLineUpdateComponent } from "./update/production-line-update.component";
import { ProductionLineDeleteDialogComponent } from "./delete/production-line-delete-dialog.component";
import { ProductionLineRoutingModule } from "./route/production-line-routing.module";

@NgModule({
  imports: [SharedModule, ProductionLineRoutingModule],
  declarations: [
    ProductionLineComponent,
    ProductionLineDetailComponent,
    ProductionLineUpdateComponent,
    ProductionLineDeleteDialogComponent,
  ],
  entryComponents: [ProductionLineDeleteDialogComponent],
})
export class ProductionLineModule {}
