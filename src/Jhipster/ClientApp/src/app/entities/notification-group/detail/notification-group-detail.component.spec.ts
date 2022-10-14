import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { NotificationGroupDetailComponent } from "./notification-group-detail.component";

describe("NotificationGroup Management Detail Component", () => {
  let comp: NotificationGroupDetailComponent;
  let fixture: ComponentFixture<NotificationGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ notificationGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NotificationGroupDetailComponent, "")
      .compileComponents();
    fixture = TestBed.createComponent(NotificationGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe("OnInit", () => {
    it("Should load notificationGroup on init", () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.notificationGroup).toEqual(
        expect.objectContaining({ id: 123 })
      );
    });
  });
});
