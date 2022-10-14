import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { LogVisionDetailComponent } from "./log-vision-detail.component";

describe("LogVision Management Detail Component", () => {
  let comp: LogVisionDetailComponent;
  let fixture: ComponentFixture<LogVisionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogVisionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ logVision: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LogVisionDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(LogVisionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load logVision on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.logVision).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
