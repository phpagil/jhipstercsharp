import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { IProductionLine, ProductionLine } from "../production-line.model";
import { ProductionLineService } from "../service/production-line.service";

@Injectable({ providedIn: "root" })
export class ProductionLineRoutingResolveService
  implements Resolve<IProductionLine>
{
  constructor(
    protected service: ProductionLineService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<IProductionLine> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productionLine: HttpResponse<ProductionLine>) => {
          if (productionLine.body) {
            return of(productionLine.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductionLine());
  }
}
