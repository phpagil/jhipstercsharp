import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { NotificationGroupService } from "../service/notification-group.service";
import {
  INotificationGroup,
  NotificationGroup,
} from "../notification-group.model";

import { NotificationGroupUpdateComponent } from "./notification-group-update.component";

describe("NotificationGroup Management Update Component", () => {
  let comp: NotificationGroupUpdateComponent;
  let fixture: ComponentFixture<NotificationGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificationGroupService: NotificationGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NotificationGroupUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(NotificationGroupUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(NotificationGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificationGroupService = TestBed.inject(NotificationGroupService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should update editForm", () => {
      const notificationGroup: INotificationGroup = { id: 456 };

      activatedRoute.data = of({ notificationGroup });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(
        expect.objectContaining(notificationGroup)
      );
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NotificationGroup>>();
      const notificationGroup = { id: 123 };
      jest
        .spyOn(notificationGroupService, "update")
        .mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ notificationGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notificationGroup }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificationGroupService.update).toHaveBeenCalledWith(
        notificationGroup
      );
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NotificationGroup>>();
      const notificationGroup = new NotificationGroup();
      jest
        .spyOn(notificationGroupService, "create")
        .mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ notificationGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notificationGroup }));
      saveSubject.complete();

      // THEN
      expect(notificationGroupService.create).toHaveBeenCalledWith(
        notificationGroup
      );
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NotificationGroup>>();
      const notificationGroup = { id: 123 };
      jest
        .spyOn(notificationGroupService, "update")
        .mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ notificationGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(notificationGroupService.update).toHaveBeenCalledWith(
        notificationGroup
      );
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
