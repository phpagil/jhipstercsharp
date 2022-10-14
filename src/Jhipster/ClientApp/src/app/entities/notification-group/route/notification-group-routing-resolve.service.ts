import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of, EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  INotificationGroup,
  NotificationGroup,
} from "../notification-group.model";
import { NotificationGroupService } from "../service/notification-group.service";

@Injectable({ providedIn: "root" })
export class NotificationGroupRoutingResolveService
  implements Resolve<INotificationGroup>
{
  constructor(
    protected service: NotificationGroupService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<INotificationGroup> | Observable<never> {
    const id = route.params["id"];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((notificationGroup: HttpResponse<NotificationGroup>) => {
          if (notificationGroup.body) {
            return of(notificationGroup.body);
          } else {
            this.router.navigate(["404"]);
            return EMPTY;
          }
        })
      );
    }
    return of(new NotificationGroup());
  }
}
