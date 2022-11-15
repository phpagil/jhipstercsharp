import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { DashboardService } from "../service/dashboard.service";


@Injectable({ providedIn: "root" })
export class DeviceRoutingResolveService implements Resolve<any> {
  constructor(protected service: DashboardService, protected router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<any> | Observable<never> {
            return EMPTY;
  }
}
