import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { FeaturesService } from "../service/features.service";

import { FeaturesComponent } from "./features.component";

describe("Features Management Component", () => {
  let comp: FeaturesComponent;
  let fixture: ComponentFixture<FeaturesComponent>;
  let service: FeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeaturesComponent],
    })
      .overrideTemplate(FeaturesComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(FeaturesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FeaturesService);

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
    expect(comp.features?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
