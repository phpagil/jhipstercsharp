import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { NotificationService } from "../service/notification.service";
import { INotification, Notification } from "../notification.model";
import { INotificationGroup } from "app/entities/notification-group/notification-group.model";
import { NotificationGroupService } from "app/entities/notification-group/service/notification-group.service";

import { NotificationUpdateComponent } from "./notification-update.component";

describe("Notification Management Update Component", () => {
  let comp: NotificationUpdateComponent;
  let fixture: ComponentFixture<NotificationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificationService: NotificationService;
  let notificationGroupService: NotificationGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NotificationUpdateComponent],
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
      .overrideTemplate(NotificationUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(NotificationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificationService = TestBed.inject(NotificationService);
    notificationGroupService = TestBed.inject(NotificationGroupService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call NotificationGroup query and add missing value", () => {
      const notification: INotification = { id: 456 };
      const notificationGroup: INotificationGroup = { id: 30308 };
      notification.notificationGroup = notificationGroup;

      const notificationGroupCollection: INotificationGroup[] = [{ id: 53816 }];
      jest
        .spyOn(notificationGroupService, "query")
        .mockReturnValue(
          of(new HttpResponse({ body: notificationGroupCollection }))
        );
      const additionalNotificationGroups = [notificationGroup];
      const expectedCollection: INotificationGroup[] = [
        ...additionalNotificationGroups,
        ...notificationGroupCollection,
      ];
      jest
        .spyOn(
          notificationGroupService,
          "addNotificationGroupToCollectionIfMissing"
        )
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(notificationGroupService.query).toHaveBeenCalled();
      expect(
        notificationGroupService.addNotificationGroupToCollectionIfMissing
      ).toHaveBeenCalledWith(
        notificationGroupCollection,
        ...additionalNotificationGroups
      );
      expect(comp.notificationGroupsSharedCollection).toEqual(
        expectedCollection
      );
    });

    it("Should update editForm", () => {
      const notification: INotification = { id: 456 };
      const notificationGroup: INotificationGroup = { id: 56430 };
      notification.notificationGroup = notificationGroup;

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(
        expect.objectContaining(notification)
      );
      expect(comp.notificationGroupsSharedCollection).toContain(
        notificationGroup
      );
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Notification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notification }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificationService.update).toHaveBeenCalledWith(notification);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Notification>>();
      const notification = new Notification();
      jest.spyOn(notificationService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notification }));
      saveSubject.complete();

      // THEN
      expect(notificationService.create).toHaveBeenCalledWith(notification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Notification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(notificationService.update).toHaveBeenCalledWith(notification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackNotificationGroupById", () => {
      it("Should return tracked NotificationGroup primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNotificationGroupById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
