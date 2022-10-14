import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

import { NotificationGroupService } from "../service/notification-group.service";

import { NotificationGroupComponent } from "./notification-group.component";

describe("NotificationGroup Management Component", () => {
  let comp: NotificationGroupComponent;
  let fixture: ComponentFixture<NotificationGroupComponent>;
  let service: NotificationGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NotificationGroupComponent],
    })
      .overrideTemplate(NotificationGroupComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(NotificationGroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NotificationGroupService);

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
    expect(comp.notificationGroups?.[0]).toEqual(
      expect.objectContaining({ id: 123 })
    );
  });
});
