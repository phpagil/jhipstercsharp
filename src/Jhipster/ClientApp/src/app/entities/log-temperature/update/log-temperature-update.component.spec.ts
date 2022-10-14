import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { LogTemperatureService } from "../service/log-temperature.service";
import { ILogTemperature, LogTemperature } from "../log-temperature.model";
import { IDevice } from "app/entities/device/device.model";
import { DeviceService } from "app/entities/device/service/device.service";

import { LogTemperatureUpdateComponent } from "./log-temperature-update.component";

describe("LogTemperature Management Update Component", () => {
  let comp: LogTemperatureUpdateComponent;
  let fixture: ComponentFixture<LogTemperatureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let logTemperatureService: LogTemperatureService;
  let deviceService: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LogTemperatureUpdateComponent],
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
      .overrideTemplate(LogTemperatureUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(LogTemperatureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    logTemperatureService = TestBed.inject(LogTemperatureService);
    deviceService = TestBed.inject(DeviceService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call Device query and add missing value", () => {
      const logTemperature: ILogTemperature = { id: 456 };
      const device: IDevice = { id: 40281 };
      logTemperature.device = device;

      const deviceCollection: IDevice[] = [{ id: 11965 }];
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

      activatedRoute.data = of({ logTemperature });
      comp.ngOnInit();

      expect(deviceService.query).toHaveBeenCalled();
      expect(deviceService.addDeviceToCollectionIfMissing).toHaveBeenCalledWith(
        deviceCollection,
        ...additionalDevices
      );
      expect(comp.devicesSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const logTemperature: ILogTemperature = { id: 456 };
      const device: IDevice = { id: 53707 };
      logTemperature.device = device;

      activatedRoute.data = of({ logTemperature });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(
        expect.objectContaining(logTemperature)
      );
      expect(comp.devicesSharedCollection).toContain(device);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LogTemperature>>();
      const logTemperature = { id: 123 };
      jest.spyOn(logTemperatureService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ logTemperature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: logTemperature }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(logTemperatureService.update).toHaveBeenCalledWith(logTemperature);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LogTemperature>>();
      const logTemperature = new LogTemperature();
      jest.spyOn(logTemperatureService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ logTemperature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: logTemperature }));
      saveSubject.complete();

      // THEN
      expect(logTemperatureService.create).toHaveBeenCalledWith(logTemperature);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LogTemperature>>();
      const logTemperature = { id: 123 };
      jest.spyOn(logTemperatureService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ logTemperature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(logTemperatureService.update).toHaveBeenCalledWith(logTemperature);
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
