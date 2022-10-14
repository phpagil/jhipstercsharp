import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { FeaturesService } from "../service/features.service";
import { IFeatures, Features } from "../features.model";

import { FeaturesUpdateComponent } from "./features-update.component";

describe("Features Management Update Component", () => {
  let comp: FeaturesUpdateComponent;
  let fixture: ComponentFixture<FeaturesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let featuresService: FeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FeaturesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FeaturesUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FeaturesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    featuresService = TestBed.inject(FeaturesService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should update editForm", () => {
      const features: IFeatures = { id: 456 };

      activatedRoute.data = of({ features });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(features));
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Features>>();
      const features = { id: 123 };
      jest.spyOn(featuresService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ features });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: features }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(featuresService.update).toHaveBeenCalledWith(features);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Features>>();
      const features = new Features();
      jest.spyOn(featuresService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ features });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: features }));
      saveSubject.complete();

      // THEN
      expect(featuresService.create).toHaveBeenCalledWith(features);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Features>>();
      const features = { id: 123 };
      jest.spyOn(featuresService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ features });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(featuresService.update).toHaveBeenCalledWith(features);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
