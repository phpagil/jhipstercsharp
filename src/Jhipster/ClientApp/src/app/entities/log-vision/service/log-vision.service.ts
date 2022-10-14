import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import dayjs from "dayjs/esm";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { ILogVision, getLogVisionIdentifier } from "../log-vision.model";

export type EntityResponseType = HttpResponse<ILogVision>;
export type EntityArrayResponseType = HttpResponse<ILogVision[]>;

@Injectable({ providedIn: "root" })
export class LogVisionService {
  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/log-visions");

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(logVision: ILogVision): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(logVision);
    return this.http
      .post<ILogVision>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(logVision: ILogVision): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(logVision);
    return this.http
      .put<ILogVision>(
        `${this.resourceUrl}/${getLogVisionIdentifier(logVision) as number}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(logVision: ILogVision): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(logVision);
    return this.http
      .patch<ILogVision>(
        `${this.resourceUrl}/${getLogVisionIdentifier(logVision) as number}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILogVision>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILogVision[]>(this.resourceUrl, {
        params: options,
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addLogVisionToCollectionIfMissing(
    logVisionCollection: ILogVision[],
    ...logVisionsToCheck: (ILogVision | null | undefined)[]
  ): ILogVision[] {
    const logVisions: ILogVision[] = logVisionsToCheck.filter(isPresent);
    if (logVisions.length > 0) {
      const logVisionCollectionIdentifiers = logVisionCollection.map(
        (logVisionItem) => getLogVisionIdentifier(logVisionItem)!
      );
      const logVisionsToAdd = logVisions.filter((logVisionItem) => {
        const logVisionIdentifier = getLogVisionIdentifier(logVisionItem);
        if (
          logVisionIdentifier == null ||
          logVisionCollectionIdentifiers.includes(logVisionIdentifier)
        ) {
          return false;
        }
        logVisionCollectionIdentifiers.push(logVisionIdentifier);
        return true;
      });
      return [...logVisionsToAdd, ...logVisionCollection];
    }
    return logVisionCollection;
  }

  protected convertDateFromClient(logVision: ILogVision): ILogVision {
    return Object.assign({}, logVision, {
      createdAt: logVision.createdAt?.isValid()
        ? logVision.createdAt.toJSON()
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt
        ? dayjs(res.body.createdAt)
        : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((logVision: ILogVision) => {
        logVision.createdAt = logVision.createdAt
          ? dayjs(logVision.createdAt)
          : undefined;
      });
    }
    return res;
  }
}
