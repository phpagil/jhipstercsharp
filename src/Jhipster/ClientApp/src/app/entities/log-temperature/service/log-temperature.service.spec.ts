import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import dayjs from "dayjs/esm";

import { DATE_TIME_FORMAT } from "app/config/input.constants";
import { Status } from "app/entities/enumerations/status.model";
import { ILogTemperature, LogTemperature } from "../log-temperature.model";

import { LogTemperatureService } from "./log-temperature.service";

describe("LogTemperature Service", () => {
  let service: LogTemperatureService;
  let httpMock: HttpTestingController;
  let elemDefault: ILogTemperature;
  let expectedResult: ILogTemperature | ILogTemperature[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LogTemperatureService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      createdAt: currentDate,
      temperature: 0,
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

    it("should create a LogTemperature", () => {
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
        .create(new LogTemperature())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a LogTemperature", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          temperature: 1,
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

    it("should partial update a LogTemperature", () => {
      const patchObject = Object.assign(
        {
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        new LogTemperature()
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

    it("should return a list of LogTemperature", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          temperature: 1,
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

    it("should delete a LogTemperature", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addLogTemperatureToCollectionIfMissing", () => {
      it("should add a LogTemperature to an empty array", () => {
        const logTemperature: ILogTemperature = { id: 123 };
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          [],
          logTemperature
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(logTemperature);
      });

      it("should not add a LogTemperature to an array that contains it", () => {
        const logTemperature: ILogTemperature = { id: 123 };
        const logTemperatureCollection: ILogTemperature[] = [
          {
            ...logTemperature,
          },
          { id: 456 },
        ];
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          logTemperatureCollection,
          logTemperature
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LogTemperature to an array that doesn't contain it", () => {
        const logTemperature: ILogTemperature = { id: 123 };
        const logTemperatureCollection: ILogTemperature[] = [{ id: 456 }];
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          logTemperatureCollection,
          logTemperature
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(logTemperature);
      });

      it("should add only unique LogTemperature to an array", () => {
        const logTemperatureArray: ILogTemperature[] = [
          { id: 123 },
          { id: 456 },
          { id: 2132 },
        ];
        const logTemperatureCollection: ILogTemperature[] = [{ id: 123 }];
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          logTemperatureCollection,
          ...logTemperatureArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const logTemperature: ILogTemperature = { id: 123 };
        const logTemperature2: ILogTemperature = { id: 456 };
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          [],
          logTemperature,
          logTemperature2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(logTemperature);
        expect(expectedResult).toContain(logTemperature2);
      });

      it("should accept null and undefined values", () => {
        const logTemperature: ILogTemperature = { id: 123 };
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          [],
          null,
          logTemperature,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(logTemperature);
      });

      it("should return initial array if no LogTemperature is added", () => {
        const logTemperatureCollection: ILogTemperature[] = [{ id: 123 }];
        expectedResult = service.addLogTemperatureToCollectionIfMissing(
          logTemperatureCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(logTemperatureCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
