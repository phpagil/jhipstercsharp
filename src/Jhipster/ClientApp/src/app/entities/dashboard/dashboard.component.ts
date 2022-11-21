import { Component } from "@angular/core";
import { LegendPosition, ScaleType } from "@swimlane/ngx-charts";
import { multi, single } from "./data";

@Component({
  selector: 'jhi-dashboard',
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  public single = single;
  public multi = multi;
  public scaleType = ScaleType;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Defeitos';
  showYAxisLabel = false;
  yAxisLabel = 'Linhas';
  legend = false;
  legendPosition = LegendPosition.Below;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    Object.assign(this, { single, multi });
  }

  onSelect(event: any): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }

  onActivate(data: any): void {
    // eslint-disable-next-line no-console
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // eslint-disable-next-line no-console
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
