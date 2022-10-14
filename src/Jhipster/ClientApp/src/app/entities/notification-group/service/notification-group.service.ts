import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import {
  INotificationGroup,
  getNotificationGroupIdentifier,
} from "../notification-group.model";

export type EntityResponseType = HttpResponse<INotificationGroup>;
export type EntityArrayResponseType = HttpResponse<INotificationGroup[]>;

@Injectable({ providedIn: "root" })
export class NotificationGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/notification-groups"
  );

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(
    notificationGroup: INotificationGroup
  ): Observable<EntityResponseType> {
    return this.http.post<INotificationGroup>(
      this.resourceUrl,
      notificationGroup,
      { observe: "response" }
    );
  }

  update(
    notificationGroup: INotificationGroup
  ): Observable<EntityResponseType> {
    return this.http.put<INotificationGroup>(
      `${this.resourceUrl}/${
        getNotificationGroupIdentifier(notificationGroup) as number
      }`,
      notificationGroup,
      { observe: "response" }
    );
  }

  partialUpdate(
    notificationGroup: INotificationGroup
  ): Observable<EntityResponseType> {
    return this.http.patch<INotificationGroup>(
      `${this.resourceUrl}/${
        getNotificationGroupIdentifier(notificationGroup) as number
      }`,
      notificationGroup,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INotificationGroup>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INotificationGroup[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addNotificationGroupToCollectionIfMissing(
    notificationGroupCollection: INotificationGroup[],
    ...notificationGroupsToCheck: (INotificationGroup | null | undefined)[]
  ): INotificationGroup[] {
    const notificationGroups: INotificationGroup[] =
      notificationGroupsToCheck.filter(isPresent);
    if (notificationGroups.length > 0) {
      const notificationGroupCollectionIdentifiers =
        notificationGroupCollection.map(
          (notificationGroupItem) =>
            getNotificationGroupIdentifier(notificationGroupItem)!
        );
      const notificationGroupsToAdd = notificationGroups.filter(
        (notificationGroupItem) => {
          const notificationGroupIdentifier = getNotificationGroupIdentifier(
            notificationGroupItem
          );
          if (
            notificationGroupIdentifier == null ||
            notificationGroupCollectionIdentifiers.includes(
              notificationGroupIdentifier
            )
          ) {
            return false;
          }
          notificationGroupCollectionIdentifiers.push(
            notificationGroupIdentifier
          );
          return true;
        }
      );
      return [...notificationGroupsToAdd, ...notificationGroupCollection];
    }
    return notificationGroupCollection;
  }
}
