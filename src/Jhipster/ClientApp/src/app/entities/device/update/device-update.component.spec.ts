import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { DeviceService } from "../service/device.service";
import { IDevice, Device } from "../device.model";
import { IProductionLine } from "app/entities/production-line/production-line.model";
import { ProductionLineService } from "app/entities/production-line/service/production-line.service";
import { INotificationGroup } from "app/entities/notification-group/notification-group.model";
import { NotificationGroupService } from "app/entities/notification-group/service/notification-group.service";

import { DeviceUpdateComponent } from "./device-update.component";

describe("Device Management Update Component", () => {
  let comp: DeviceUpdateComponent;
  let fixture: ComponentFixture<DeviceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let deviceService: DeviceService;
  let productionLineService: ProductionLineService;
  let notificationGroupService: NotificationGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DeviceUpdateComponent],
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
      .overrideTemplate(DeviceUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(DeviceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    deviceService = TestBed.inject(DeviceService);
    productionLineService = TestBed.inject(ProductionLineService);
    notificationGroupService = TestBed.inject(NotificationGroupService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call ProductionLine query and add missing value", () => {
      const device: IDevice = { id: 456 };
      const productionLine: IProductionLine = { id: 20130 };
      device.productionLine = productionLine;

      const productionLineCollection: IProductionLine[] = [{ id: 45858 }];
      jest
        .spyOn(productionLineService, "query")
        .mockReturnValue(
          of(new HttpResponse({ body: productionLineCollection }))
        );
      const additionalProductionLines = [productionLine];
      const expectedCollection: IProductionLine[] = [
        ...additionalProductionLines,
        ...productionLineCollection,
      ];
      jest
        .spyOn(productionLineService, "addProductionLineToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ device });
      comp.ngOnInit();

      expect(productionLineService.query).toHaveBeenCalled();
      expect(
        productionLineService.addProductionLineToCollectionIfMissing
      ).toHaveBeenCalledWith(
        productionLineCollection,
        ...additionalProductionLines
      );
      expect(comp.productionLinesSharedCollection).toEqual(expectedCollection);
    });

    it("Should call NotificationGroup query and add missing value", () => {
      const device: IDevice = { id: 456 };
      const notificationGroup: INotificationGroup = { id: 23596 };
      device.notificationGroup = notificationGroup;

      const notificationGroupCollection: INotificationGroup[] = [{ id: 74914 }];
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

      activatedRoute.data = of({ device });
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
      const device: IDevice = { id: 456 };
      const productionLine: IProductionLine = { id: 45893 };
      device.productionLine = productionLine;
      const notificationGroup: INotificationGroup = { id: 85402 };
      device.notificationGroup = notificationGroup;

      activatedRoute.data = of({ device });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(device));
      expect(comp.productionLinesSharedCollection).toContain(productionLine);
      expect(comp.notificationGroupsSharedCollection).toContain(
        notificationGroup
      );
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Device>>();
      const device = { id: 123 };
      jest.spyOn(deviceService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ device });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: device }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(deviceService.update).toHaveBeenCalledWith(device);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Device>>();
      const device = new Device();
      jest.spyOn(deviceService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ device });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: device }));
      saveSubject.complete();

      // THEN
      expect(deviceService.create).toHaveBeenCalledWith(device);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Device>>();
      const device = { id: 123 };
      jest.spyOn(deviceService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ device });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(deviceService.update).toHaveBeenCalledWith(device);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackProductionLineById", () => {
      it("Should return tracked ProductionLine primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductionLineById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe("trackNotificationGroupById", () => {
      it("Should return tracked NotificationGroup primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNotificationGroupById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
