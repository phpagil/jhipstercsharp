import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { IFeatures, Features } from "../features.model";

import { FeaturesService } from "./features.service";

describe("Features Service", () => {
  let service: FeaturesService;
  let httpMock: HttpTestingController;
  let elemDefault: IFeatures;
  let expectedResult: IFeatures | IFeatures[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeaturesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      description: "AAAAAAA",
      route: "AAAAAAA",
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

    it("should create a Features", () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service
        .create(new Features())
        .subscribe((resp) => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "POST" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a Features", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
          route: "BBBBBB",
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

    it("should partial update a Features", () => {
      const patchObject = Object.assign(
        {
          route: "BBBBBB",
        },
        new Features()
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

    it("should return a list of Features", () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: "BBBBBB",
          route: "BBBBBB",
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

    it("should delete a Features", () => {
      service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe("addFeaturesToCollectionIfMissing", () => {
      it("should add a Features to an empty array", () => {
        const features: IFeatures = { id: 123 };
        expectedResult = service.addFeaturesToCollectionIfMissing([], features);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(features);
      });

      it("should not add a Features to an array that contains it", () => {
        const features: IFeatures = { id: 123 };
        const featuresCollection: IFeatures[] = [
          {
            ...features,
          },
          { id: 456 },
        ];
        expectedResult = service.addFeaturesToCollectionIfMissing(
          featuresCollection,
          features
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Features to an array that doesn't contain it", () => {
        const features: IFeatures = { id: 123 };
        const featuresCollection: IFeatures[] = [{ id: 456 }];
        expectedResult = service.addFeaturesToCollectionIfMissing(
          featuresCollection,
          features
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(features);
      });

      it("should add only unique Features to an array", () => {
        const featuresArray: IFeatures[] = [
          { id: 123 },
          { id: 456 },
          { id: 65366 },
        ];
        const featuresCollection: IFeatures[] = [{ id: 123 }];
        expectedResult = service.addFeaturesToCollectionIfMissing(
          featuresCollection,
          ...featuresArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const features: IFeatures = { id: 123 };
        const features2: IFeatures = { id: 456 };
        expectedResult = service.addFeaturesToCollectionIfMissing(
          [],
          features,
          features2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(features);
        expect(expectedResult).toContain(features2);
      });

      it("should accept null and undefined values", () => {
        const features: IFeatures = { id: 123 };
        expectedResult = service.addFeaturesToCollectionIfMissing(
          [],
          null,
          features,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(features);
      });

      it("should return initial array if no Features is added", () => {
        const featuresCollection: IFeatures[] = [{ id: 123 }];
        expectedResult = service.addFeaturesToCollectionIfMissing(
          featuresCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(featuresCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
