import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import {
  INotificationGroup,
  NotificationGroup,
} from "../notification-group.model";

import { NotificationGroupService } from "./notification-group.service";

describe("NotificationGroup Service", () => {
  let service: NotificationGroupService;
  let httpMock: HttpTestingController;
  let elemDefault: INotificationGroup;
  let expectedResult:
    | INotificationGroup
    | INotificationGroup[]
    | boolean
    | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NotificationGroupService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      description: "AAAAAAA",
    };
  });

  describe("Service methods", () => {
    it("should find an element", () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it("should create a NotificationGroup", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .create(new NotificationGroup())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a NotificationGroup", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .update(expected)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PUT" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should partial update a NotificationGroup", () => {
      const patchObject = Object.assign(
        {
          description: "BBBBBB",
        },
        new NotificationGroup()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service
        .partialUpdate(patchObject)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PATCH" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should return a list of NotificationGroup", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it("should delete a NotificationGroup", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addNotificationGroupToCollectionIfMissing", () => {
      it("should add a NotificationGroup to an empty array", () => {
        const notificationGroup: INotificationGroup = { id: 123 };
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          [],
          notificationGroup
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notificationGroup);
      });

      it("should not add a NotificationGroup to an array that contains it", () => {
        const notificationGroup: INotificationGroup = { id: 123 };
        const notificationGroupCollection: INotificationGroup[] = [
          {
            ...notificationGroup,
          },
          { id: 456 },
        ];
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          notificationGroupCollection,
          notificationGroup
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NotificationGroup to an array that doesn't contain it", () => {
        const notificationGroup: INotificationGroup = { id: 123 };
        const notificationGroupCollection: INotificationGroup[] = [{ id: 456 }];
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          notificationGroupCollection,
          notificationGroup
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notificationGroup);
      });

      it("should add only unique NotificationGroup to an array", () => {
        const notificationGroupArray: INotificationGroup[] = [
          { id: 123 },
          { id: 456 },
          { id: 76593 },
        ];
        const notificationGroupCollection: INotificationGroup[] = [{ id: 123 }];
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          notificationGroupCollection,
          ...notificationGroupArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const notificationGroup: INotificationGroup = { id: 123 };
        const notificationGroup2: INotificationGroup = { id: 456 };
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          [],
          notificationGroup,
          notificationGroup2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notificationGroup);
        expect(expectedResult).toContain(notificationGroup2);
      });

      it("should accept null and undefined values", () => {
        const notificationGroup: INotificationGroup = { id: 123 };
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          [],
          null,
          notificationGroup,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notificationGroup);
      });

      it("should return initial array if no NotificationGroup is added", () => {
        const notificationGroupCollection: INotificationGroup[] = [{ id: 123 }];
        expectedResult = service.addNotificationGroupToCollectionIfMissing(
          notificationGroupCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(notificationGroupCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
