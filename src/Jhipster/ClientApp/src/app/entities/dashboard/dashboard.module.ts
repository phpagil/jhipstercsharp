import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LOGIN_ROUTE } from 'app/login/login.route';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './route/dashboard-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  imports: [SharedModule, NgxChartsModule, DashboardRoutingModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }


