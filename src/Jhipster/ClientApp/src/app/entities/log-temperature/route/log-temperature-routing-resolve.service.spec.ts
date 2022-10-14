import { TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
  convertToParamMap,
} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

import { ILogTemperature, LogTemperature } from "../log-temperature.model";
import { LogTemperatureService } from "../service/log-temperature.service";

import { LogTemperatureRoutingResolveService } from "./log-temperature-routing-resolve.service";

describe("LogTemperature routing resolve service", () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LogTemperatureRoutingResolveService;
  let service: LogTemperatureService;
  let resultLogTemperature: ILogTemperature | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest
      .spyOn(mockRouter, "navigate")
      .mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(LogTemperatureRoutingResolveService);
    service = TestBed.inject(LogTemperatureService);
    resultLogTemperature = undefined;
  });

  describe("resolve", () => {
    it("should return ILogTemperature returned by find", () => {
      // GIVEN
      service.find = jest.fn((id) => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultLogTemperature = result;
        });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLogTemperature).toEqual({ id: 123 });
    });

    it("should return new ILogTemperature if id is not provided", () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultLogTemperature = result;
        });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLogTemperature).toEqual(new LogTemperature());
    });

    it("should route to 404 page if data not found in server", () => {
      // GIVEN
      jest
        .spyOn(service, "find")
        .mockReturnValue(
          of(new HttpResponse({ body: null as unknown as LogTemperature }))
        );
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultLogTemperature = result;
        });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLogTemperature).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(["404"]);
    });
  });
});
