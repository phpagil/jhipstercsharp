import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginModule } from './../login/login.module';

import { SharedModule } from "app/shared/shared.module";
import { HOME_ROUTE } from "./home.route";
import { HomeComponent } from "./home.component";
import { DashboardModule } from "app/entities/dashboard/dashboard.module";

@NgModule({
  imports: [SharedModule, DashboardModule, LoginModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class HomeModule {}
