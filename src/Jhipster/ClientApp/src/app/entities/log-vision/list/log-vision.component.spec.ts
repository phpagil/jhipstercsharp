import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { LogVisionService } from "../service/log-vision.service";

import { LogVisionComponent } from "./log-vision.component";

describe("LogVision Management Component", () => {
  let comp: LogVisionComponent;
  let fixture: ComponentFixture<LogVisionComponent>;
  let service: LogVisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LogVisionComponent],
    })
      .overrideTemplate(LogVisionComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(LogVisionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LogVisionService);

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
    expect(comp.logVisions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
