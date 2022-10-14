import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import dayjs from "dayjs/esm";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import {
  IProductionLine,
  getProductionLineIdentifier,
} from "../production-line.model";

export type EntityResponseType = HttpResponse<IProductionLine>;
export type EntityArrayResponseType = HttpResponse<IProductionLine[]>;

@Injectable({ providedIn: "root" })
export class ProductionLineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/production-lines"
  );

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(productionLine: IProductionLine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productionLine);
    return this.http
      .post<IProductionLine>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productionLine: IProductionLine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productionLine);
    return this.http
      .put<IProductionLine>(
        `${this.resourceUrl}/${
          getProductionLineIdentifier(productionLine) as number
        }`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(
    productionLine: IProductionLine
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productionLine);
    return this.http
      .patch<IProductionLine>(
        `${this.resourceUrl}/${
          getProductionLineIdentifier(productionLine) as number
        }`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductionLine>(`${this.resourceUrl}/${id}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductionLine[]>(this.resourceUrl, {
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

  addProductionLineToCollectionIfMissing(
    productionLineCollection: IProductionLine[],
    ...productionLinesToCheck: (IProductionLine | null | undefined)[]
  ): IProductionLine[] {
    const productionLines: IProductionLine[] =
      productionLinesToCheck.filter(isPresent);
    if (productionLines.length > 0) {
      const productionLineCollectionIdentifiers = productionLineCollection.map(
        (productionLineItem) => getProductionLineIdentifier(productionLineItem)!
      );
      const productionLinesToAdd = productionLines.filter(
        (productionLineItem) => {
          const productionLineIdentifier =
            getProductionLineIdentifier(productionLineItem);
          if (
            productionLineIdentifier == null ||
            productionLineCollectionIdentifiers.includes(
              productionLineIdentifier
            )
          ) {
            return false;
          }
          productionLineCollectionIdentifiers.push(productionLineIdentifier);
          return true;
        }
      );
      return [...productionLinesToAdd, ...productionLineCollection];
    }
    return productionLineCollection;
  }

  protected convertDateFromClient(
    productionLine: IProductionLine
  ): IProductionLine {
    return Object.assign({}, productionLine, {
      createdAt: productionLine.createdAt?.isValid()
        ? productionLine.createdAt.toJSON()
        : undefined,
      updatedAt: productionLine.updatedAt?.isValid()
        ? productionLine.updatedAt.toJSON()
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt
        ? dayjs(res.body.createdAt)
        : undefined;
      res.body.updatedAt = res.body.updatedAt
        ? dayjs(res.body.updatedAt)
        : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productionLine: IProductionLine) => {
        productionLine.createdAt = productionLine.createdAt
          ? dayjs(productionLine.createdAt)
          : undefined;
        productionLine.updatedAt = productionLine.updatedAt
          ? dayjs(productionLine.updatedAt)
          : undefined;
      });
    }
    return res;
  }
}
