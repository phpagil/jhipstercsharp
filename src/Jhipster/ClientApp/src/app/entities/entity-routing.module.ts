import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "device",
        data: { pageTitle: "jhipsterApp.device.home.title" },
        loadChildren: () =>
          import("./device/device.module").then((m) => m.DeviceModule),
      },
      {
        path: "features",
        data: { pageTitle: "jhipsterApp.features.home.title" },
        loadChildren: () =>
          import("./features/features.module").then((m) => m.FeaturesModule),
      },
      {
        path: "log-temperature",
        data: { pageTitle: "jhipsterApp.logTemperature.home.title" },
        loadChildren: () =>
          import("./log-temperature/log-temperature.module").then(
            (m) => m.LogTemperatureModule
          ),
      },
      {
        path: "log-vision",
        data: { pageTitle: "jhipsterApp.logVision.home.title" },
        loadChildren: () =>
          import("./log-vision/log-vision.module").then(
            (m) => m.LogVisionModule
          ),
      },
      {
        path: "notification",
        data: { pageTitle: "jhipsterApp.notification.home.title" },
        loadChildren: () =>
          import("./notification/notification.module").then(
            (m) => m.NotificationModule
          ),
      },
      {
        path: "notification-group",
        data: { pageTitle: "jhipsterApp.notificationGroup.home.title" },
        loadChildren: () =>
          import("./notification-group/notification-group.module").then(
            (m) => m.NotificationGroupModule
          ),
      },
      {
        path: "production-line",
        data: { pageTitle: "jhipsterApp.productionLine.home.title" },
        loadChildren: () =>
          import("./production-line/production-line.module").then(
            (m) => m.ProductionLineModule
          ),
      },
      {
        path: "dashboard",
        data: { pageTitle: "Dashboard" },
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
