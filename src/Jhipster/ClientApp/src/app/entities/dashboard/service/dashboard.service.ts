import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";


@Injectable({ providedIn: "root" })
export class DashboardService {
  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/dashboard");

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  find(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }
}
