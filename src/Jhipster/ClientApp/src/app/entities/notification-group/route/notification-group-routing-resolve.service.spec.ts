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

import {
  INotificationGroup,
  NotificationGroup,
} from "../notification-group.model";
import { NotificationGroupService } from "../service/notification-group.service";

import { NotificationGroupRoutingResolveService } from "./notification-group-routing-resolve.service";

describe("NotificationGroup routing resolve service", () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: NotificationGroupRoutingResolveService;
  let service: NotificationGroupService;
  let resultNotificationGroup: INotificationGroup | undefined;

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
    routingResolveService = TestBed.inject(
      NotificationGroupRoutingResolveService
    );
    service = TestBed.inject(NotificationGroupService);
    resultNotificationGroup = undefined;
  });

  describe("resolve", () => {
    it("should return INotificationGroup returned by find", () => {
      // GIVEN
      service.find = jest.fn((id) => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultNotificationGroup = result;
        });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNotificationGroup).toEqual({ id: 123 });
    });

    it("should return new INotificationGroup if id is not provided", () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultNotificationGroup = result;
        });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultNotificationGroup).toEqual(new NotificationGroup());
    });

    it("should route to 404 page if data not found in server", () => {
      // GIVEN
      jest
        .spyOn(service, "find")
        .mockReturnValue(
          of(new HttpResponse({ body: null as unknown as NotificationGroup }))
        );
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService
        .resolve(mockActivatedRouteSnapshot)
        .subscribe((result) => {
          resultNotificationGroup = result;
        });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNotificationGroup).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(["404"]);
    });
  });
});
