import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { LogTemperatureDetailComponent } from "./log-temperature-detail.component";

describe("LogTemperature Management Detail Component", () => {
  let comp: LogTemperatureDetailComponent;
  let fixture: ComponentFixture<LogTemperatureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogTemperatureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ logTemperature: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LogTemperatureDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(LogTemperatureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load logTemperature on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.logTemperature).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
