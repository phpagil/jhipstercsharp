import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { ILogTemperature, LogTemperature } from "../log-temperature.model";
import { LogTemperatureService } from "../service/log-temperature.service";

@Injectable({ providedIn: "root" })
export class LogTemperatureRoutingResolveService
  implements Resolve<ILogTemperature>
{
  constructor(
    protected service: LogTemperatureService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ILogTemperature> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((logTemperature: HttpResponse<LogTemperature>) => {
          if (logTemperature.body) {
            return of(logTemperature.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new LogTemperature());
  }
}
