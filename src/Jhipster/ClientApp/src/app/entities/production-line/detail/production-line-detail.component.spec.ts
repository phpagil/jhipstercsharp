import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { ProductionLineDetailComponent } from "./production-line-detail.component";

describe("ProductionLine Management Detail Component", () => {
  let comp: ProductionLineDetailComponent;
  let fixture: ComponentFixture<ProductionLineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionLineDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productionLine: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductionLineDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(ProductionLineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load productionLine on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productionLine).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
