import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { IFeatures, Features } from "../features.model";
import { FeaturesService } from "../service/features.service";

@Injectable({ providedIn: "root" })
export class FeaturesRoutingResolveService implements Resolve<IFeatures> {
  constructor(protected service: FeaturesService, protected router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IFeatures> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((features: HttpResponse<Features>) => {
          if (features.body) {
            return of(features.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new Features());
  }
}
