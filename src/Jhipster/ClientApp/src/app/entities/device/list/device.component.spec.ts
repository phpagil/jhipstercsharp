import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { DeviceService } from "../service/device.service";

import { DeviceComponent } from "./device.component";

describe("Device Management Component", () => {
  let comp: DeviceComponent;
  let fixture: ComponentFixture<DeviceComponent>;
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DeviceComponent],
    })
      .overrideTemplate(DeviceComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(DeviceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DeviceService);

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
    expect(comp.devices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
