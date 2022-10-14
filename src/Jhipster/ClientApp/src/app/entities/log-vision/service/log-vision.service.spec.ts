import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import dayjs from "dayjs/esm";

import { DATE_TIME_FORMAT } from "app/config/input.constants";
import { Status } from "app/entities/enumerations/status.model";
import { ILogVision, LogVision } from "../log-vision.model";

import { LogVisionService } from "./log-vision.service";

describe("LogVision Service", () => {
  let service: LogVisionService;
  let httpMock: HttpTestingController;
  let elemDefault: ILogVision;
  let expectedResult: ILogVision | ILogVision[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LogVisionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      createdAt: currentDate,
      imagePath: "AAAAAAA",
      status: Status.OK,
    };
  });

  describe("Service methods", () => {
    it("should find an element", () => {
      const returnedFromService = Object.assign(
        {
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it("should create a LogVision", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service
        .create(new LogVision())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a LogVision", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          imagePath: "BBBBBB",
          status: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service
        .update(expected)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PUT" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should partial update a LogVision", () => {
      const patchObject = Object.assign(
        {
          imagePath: "BBBBBB",
          status: "BBBBBB",
        },
        new LogVision()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service
        .partialUpdate(patchObject)
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PATCH" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should return a list of LogVision", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          imagePath: "BBBBBB",
          status: "BBBBBB",
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it("should delete a LogVision", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addLogVisionToCollectionIfMissing", () => {
      it("should add a LogVision to an empty array", () => {
        const logVision: ILogVision = { id: 123 };
        expectedResult = service.addLogVisionToCollectionIfMissing(
          [],
          logVision
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(logVision);
      });

      it("should not add a LogVision to an array that contains it", () => {
        const logVision: ILogVision = { id: 123 };
        const logVisionCollection: ILogVision[] = [
          {
            ...logVision,
          },
          { id: 456 },
        ];
        expectedResult = service.addLogVisionToCollectionIfMissing(
          logVisionCollection,
          logVision
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LogVision to an array that doesn't contain it", () => {
        const logVision: ILogVision = { id: 123 };
        const logVisionCollection: ILogVision[] = [{ id: 456 }];
        expectedResult = service.addLogVisionToCollectionIfMissing(
          logVisionCollection,
          logVision
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(logVision);
      });

      it("should add only unique LogVision to an array", () => {
        const logVisionArray: ILogVision[] = [
          { id: 123 },
          { id: 456 },
          { id: 91734 },
        ];
        const logVisionCollection: ILogVision[] = [{ id: 123 }];
        expectedResult = service.addLogVisionToCollectionIfMissing(
          logVisionCollection,
          ...logVisionArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const logVision: ILogVision = { id: 123 };
        const logVision2: ILogVision = { id: 456 };
        expectedResult = service.addLogVisionToCollectionIfMissing(
          [],
          logVision,
          logVision2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(logVision);
        expect(expectedResult).toContain(logVision2);
      });

      it("should accept null and undefined values", () => {
        const logVision: ILogVision = { id: 123 };
        expectedResult = service.addLogVisionToCollectionIfMissing(
          [],
          null,
          logVision,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(logVision);
      });

      it("should return initial array if no LogVision is added", () => {
        const logVisionCollection: ILogVision[] = [{ id: 123 }];
        expectedResult = service.addLogVisionToCollectionIfMissing(
          logVisionCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(logVisionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
