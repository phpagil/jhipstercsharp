import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { LogTemperatureService } from "../service/log-temperature.service";

import { LogTemperatureComponent } from "./log-temperature.component";

describe("LogTemperature Management Component", () => {
  let comp: LogTemperatureComponent;
  let fixture: ComponentFixture<LogTemperatureComponent>;
  let service: LogTemperatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LogTemperatureComponent],
    })
      .overrideTemplate(LogTemperatureComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(LogTemperatureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LogTemperatureService);

    const headers = new HttpHeaders();
    jest.spyOn(service, "query").mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it("Should call load all on init", () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.logTemperatures?.[0]).toEqual(
      expect.objectContaining({ id: 123 })
    );
  });
});
