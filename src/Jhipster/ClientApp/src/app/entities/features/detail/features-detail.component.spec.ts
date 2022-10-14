import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { FeaturesDetailComponent } from "./features-detail.component";

describe("Features Management Detail Component", () => {
  let comp: FeaturesDetailComponent;
  let fixture: ComponentFixture<FeaturesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ features: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeaturesDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(FeaturesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load features on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.features).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
