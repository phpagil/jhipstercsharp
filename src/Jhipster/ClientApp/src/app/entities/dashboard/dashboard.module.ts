import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LOGIN_ROUTE } from 'app/login/login.route';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './route/dashboard-routing.module';


@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }


