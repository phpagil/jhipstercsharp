import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import dayjs from "dayjs/esm";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import {
  ILogTemperature,
  getLogTemperatureIdentifier,
} from "../log-temperature.model";

export type EntityResponseType = HttpResponse<ILogTemperature>;
export type EntityArrayResponseType = HttpResponse<ILogTemperature[]>;

@Injectable({ providedIn: "root" })
export class LogTemperatureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/log-temperatures"
  );

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(logTemperature: ILogTemperature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(logTemperature);
    return this.http
      .post<ILogTemperature>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(logTemperature: ILogTemperature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(logTemperature);
    return this.http
      .put<ILogTemperature>(
        `${this.resourceUrl}/${
          getLogTemperatureIdentifier(logTemperature) as number
        }`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(
    logTemperature: ILogTemperature
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(logTemperature);
    return this.http
      .patch<ILogTemperature>(
        `${this.resourceUrl}/${
          getLogTemperatureIdentifier(logTemperature) as number
        }`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILogTemperature>(`${this.resourceUrl}/${id}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILogTemperature[]>(this.resourceUrl, {
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

  addLogTemperatureToCollectionIfMissing(
    logTemperatureCollection: ILogTemperature[],
    ...logTemperaturesToCheck: (ILogTemperature | null | undefined)[]
  ): ILogTemperature[] {
    const logTemperatures: ILogTemperature[] =
      logTemperaturesToCheck.filter(isPresent);
    if (logTemperatures.length > 0) {
      const logTemperatureCollectionIdentifiers = logTemperatureCollection.map(
        (logTemperatureItem) => getLogTemperatureIdentifier(logTemperatureItem)!
      );
      const logTemperaturesToAdd = logTemperatures.filter(
        (logTemperatureItem) => {
          const logTemperatureIdentifier =
            getLogTemperatureIdentifier(logTemperatureItem);
          if (
            logTemperatureIdentifier == null ||
            logTemperatureCollectionIdentifiers.includes(
              logTemperatureIdentifier
            )
          ) {
            return false;
          }
          logTemperatureCollectionIdentifiers.push(logTemperatureIdentifier);
          return true;
        }
      );
      return [...logTemperaturesToAdd, ...logTemperatureCollection];
    }
    return logTemperatureCollection;
  }

  protected convertDateFromClient(
    logTemperature: ILogTemperature
  ): ILogTemperature {
    return Object.assign({}, logTemperature, {
      createdAt: logTemperature.createdAt?.isValid()
        ? logTemperature.createdAt.toJSON()
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
      res.body.forEach((logTemperature: ILogTemperature) => {
        logTemperature.createdAt = logTemperature.createdAt
          ? dayjs(logTemperature.createdAt)
          : undefined;
      });
    }
    return res;
  }
}
