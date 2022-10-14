import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { ProductionLineService } from "../service/production-line.service";
import { IProductionLine, ProductionLine } from "../production-line.model";

import { ProductionLineUpdateComponent } from "./production-line-update.component";

describe("ProductionLine Management Update Component", () => {
  let comp: ProductionLineUpdateComponent;
  let fixture: ComponentFixture<ProductionLineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productionLineService: ProductionLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductionLineUpdateComponent],
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
      .overrideTemplate(ProductionLineUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(ProductionLineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productionLineService = TestBed.inject(ProductionLineService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should update editForm", () => {
      const productionLine: IProductionLine = { id: 456 };

      activatedRoute.data = of({ productionLine });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(
        expect.objectContaining(productionLine)
      );
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductionLine>>();
      const productionLine = { id: 123 };
      jest.spyOn(productionLineService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ productionLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productionLine }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productionLineService.update).toHaveBeenCalledWith(productionLine);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductionLine>>();
      const productionLine = new ProductionLine();
      jest.spyOn(productionLineService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ productionLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productionLine }));
      saveSubject.complete();

      // THEN
      expect(productionLineService.create).toHaveBeenCalledWith(productionLine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductionLine>>();
      const productionLine = { id: 123 };
      jest.spyOn(productionLineService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ productionLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(productionLineService.update).toHaveBeenCalledWith(productionLine);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
