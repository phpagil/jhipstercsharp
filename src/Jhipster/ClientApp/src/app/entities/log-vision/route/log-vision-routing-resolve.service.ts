import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { ILogVision, LogVision } from "../log-vision.model";
import { LogVisionService } from "../service/log-vision.service";

@Injectable({ providedIn: "root" })
export class LogVisionRoutingResolveService implements Resolve<ILogVision> {
  constructor(protected service: LogVisionService, protected router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ILogVision> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((logVision: HttpResponse<LogVision>) => {
          if (logVision.body) {
            return of(logVision.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new LogVision());
  }
}
