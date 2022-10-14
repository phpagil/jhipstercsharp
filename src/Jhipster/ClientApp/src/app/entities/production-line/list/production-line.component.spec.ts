import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { ProductionLineService } from "../service/production-line.service";

import { ProductionLineComponent } from "./production-line.component";

describe("ProductionLine Management Component", () => {
  let comp: ProductionLineComponent;
  let fixture: ComponentFixture<ProductionLineComponent>;
  let service: ProductionLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductionLineComponent],
    })
      .overrideTemplate(ProductionLineComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(ProductionLineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductionLineService);

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
    expect(comp.productionLines?.[0]).toEqual(
      expect.objectContaining({ id: 123 })
    );
  });
});
