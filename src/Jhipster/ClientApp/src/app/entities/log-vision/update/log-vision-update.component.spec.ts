import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { LogVisionService } from "../service/log-vision.service";
import { ILogVision, LogVision } from "../log-vision.model";
import { IDevice } from "app/entities/device/device.model";
import { DeviceService } from "app/entities/device/service/device.service";

import { LogVisionUpdateComponent } from "./log-vision-update.component";

describe("LogVision Management Update Component", () => {
  let comp: LogVisionUpdateComponent;
  let fixture: ComponentFixture<LogVisionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let logVisionService: LogVisionService;
  let deviceService: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LogVisionUpdateComponent],
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
      .overrideTemplate(LogVisionUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(LogVisionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    logVisionService = TestBed.inject(LogVisionService);
    deviceService = TestBed.inject(DeviceService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call Device query and add missing value", () => {
      const logVision: ILogVision = { id: 456 };
      const device: IDevice = { id: 41094 };
      logVision.device = device;

      const deviceCollection: IDevice[] = [{ id: 62309 }];
      jest
        .spyOn(deviceService, "query")
        .mockReturnValue(of(new HttpResponse({ body: deviceCollection })));
      const additionalDevices = [device];
      const expectedCollection: IDevice[] = [
        ...additionalDevices,
        ...deviceCollection,
      ];
      jest
        .spyOn(deviceService, "addDeviceToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ logVision });
      comp.ngOnInit();

      expect(deviceService.query).toHaveBeenCalled();
      expect(deviceService.addDeviceToCollectionIfMissing).toHaveBeenCalledWith(
        deviceCollection,
        ...additionalDevices
      );
      expect(comp.devicesSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const logVision: ILogVision = { id: 456 };
      const device: IDevice = { id: 29522 };
      logVision.device = device;

      activatedRoute.data = of({ logVision });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(logVision));
      expect(comp.devicesSharedCollection).toContain(device);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LogVision>>();
      const logVision = { id: 123 };
      jest.spyOn(logVisionService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ logVision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: logVision }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(logVisionService.update).toHaveBeenCalledWith(logVision);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LogVision>>();
      const logVision = new LogVision();
      jest.spyOn(logVisionService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ logVision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: logVision }));
      saveSubject.complete();

      // THEN
      expect(logVisionService.create).toHaveBeenCalledWith(logVision);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LogVision>>();
      const logVision = { id: 123 };
      jest.spyOn(logVisionService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ logVision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(logVisionService.update).toHaveBeenCalledWith(logVision);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackDeviceById", () => {
      it("Should return tracked Device primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDeviceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
