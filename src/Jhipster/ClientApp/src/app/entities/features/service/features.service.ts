import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IFeatures, getFeaturesIdentifier } from "../features.model";

export type EntityResponseType = HttpResponse<IFeatures>;
export type EntityArrayResponseType = HttpResponse<IFeatures[]>;

@Injectable({ providedIn: "root" })
export class FeaturesService {
  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/features");

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(features: IFeatures): Observable<EntityResponseType> {
    return this.http.post<IFeatures>(this.resourceUrl, features, {
      observe: "response",
    });
  }

  update(features: IFeatures): Observable<EntityResponseType> {
    return this.http.put<IFeatures>(
      `${this.resourceUrl}/${getFeaturesIdentifier(features) as number}`,
      features,
      { observe: "response" }
    );
  }

  partialUpdate(features: IFeatures): Observable<EntityResponseType> {
    return this.http.patch<IFeatures>(
      `${this.resourceUrl}/${getFeaturesIdentifier(features) as number}`,
      features,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFeatures>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFeatures[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addFeaturesToCollectionIfMissing(
    featuresCollection: IFeatures[],
    ...featuresToCheck: (IFeatures | null | undefined)[]
  ): IFeatures[] {
    const features: IFeatures[] = featuresToCheck.filter(isPresent);
    if (features.length > 0) {
      const featuresCollectionIdentifiers = featuresCollection.map(
        (featuresItem) => getFeaturesIdentifier(featuresItem)!
      );
      const featuresToAdd = features.filter((featuresItem) => {
        const featuresIdentifier = getFeaturesIdentifier(featuresItem);
        if (
          featuresIdentifier == null ||
          featuresCollectionIdentifiers.includes(featuresIdentifier)
        ) {
          return false;
        }
        featuresCollectionIdentifiers.push(featuresIdentifier);
        return true;
      });
      return [...featuresToAdd, ...featuresCollection];
    }
    return featuresCollection;
  }
}
