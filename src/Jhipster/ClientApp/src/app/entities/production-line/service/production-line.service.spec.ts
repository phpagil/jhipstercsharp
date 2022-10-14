import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import dayjs from "dayjs/esm";

import { DATE_TIME_FORMAT } from "app/config/input.constants";
import { IProductionLine, ProductionLine } from "../production-line.model";

import { ProductionLineService } from "./production-line.service";

describe("ProductionLine Service", () => {
  let service: ProductionLineService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductionLine;
  let expectedResult: IProductionLine | IProductionLine[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductionLineService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      description: "AAAAAAA",
      createdAt: currentDate,
      updatedAt: currentDate,
    };
  });

  describe("Service methods", () => {
    it("should find an element", () => {
      const returnedFromService = Object.assign(
        {
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          updatedAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it("should create a ProductionLine", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          updatedAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        returnedFromService
      );

      service
        .create(new ProductionLine())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a ProductionLine", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          updatedAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
          updatedAt: currentDate,
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

    it("should partial update a ProductionLine", () => {
      const patchObject = Object.assign(
        {
          description: "BBBBBB",
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          updatedAt: currentDate.format(DATE_TIME_FORMAT),
        },
        new ProductionLine()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdAt: currentDate,
          updatedAt: currentDate,
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

    it("should return a list of ProductionLine", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
          createdAt: currentDate.format(DATE_TIME_FORMAT),
          updatedAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it("should delete a ProductionLine", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addProductionLineToCollectionIfMissing", () => {
      it("should add a ProductionLine to an empty array", () => {
        const productionLine: IProductionLine = { id: 123 };
        expectedResult = service.addProductionLineToCollectionIfMissing(
          [],
          productionLine
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productionLine);
      });

      it("should not add a ProductionLine to an array that contains it", () => {
        const productionLine: IProductionLine = { id: 123 };
        const productionLineCollection: IProductionLine[] = [
          {
            ...productionLine,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductionLineToCollectionIfMissing(
          productionLineCollection,
          productionLine
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductionLine to an array that doesn't contain it", () => {
        const productionLine: IProductionLine = { id: 123 };
        const productionLineCollection: IProductionLine[] = [{ id: 456 }];
        expectedResult = service.addProductionLineToCollectionIfMissing(
          productionLineCollection,
          productionLine
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productionLine);
      });

      it("should add only unique ProductionLine to an array", () => {
        const productionLineArray: IProductionLine[] = [
          { id: 123 },
          { id: 456 },
          { id: 48114 },
        ];
        const productionLineCollection: IProductionLine[] = [{ id: 123 }];
        expectedResult = service.addProductionLineToCollectionIfMissing(
          productionLineCollection,
          ...productionLineArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const productionLine: IProductionLine = { id: 123 };
        const productionLine2: IProductionLine = { id: 456 };
        expectedResult = service.addProductionLineToCollectionIfMissing(
          [],
          productionLine,
          productionLine2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productionLine);
        expect(expectedResult).toContain(productionLine2);
      });

      it("should accept null and undefined values", () => {
        const productionLine: IProductionLine = { id: 123 };
        expectedResult = service.addProductionLineToCollectionIfMissing(
          [],
          null,
          productionLine,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productionLine);
      });

      it("should return initial array if no ProductionLine is added", () => {
        const productionLineCollection: IProductionLine[] = [{ id: 123 }];
        expectedResult = service.addProductionLineToCollectionIfMissing(
          productionLineCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(productionLineCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
