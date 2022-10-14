import { IProductionLine } from "app/entities/production-line/production-line.model";
import { INotificationGroup } from "app/entities/notification-group/notification-group.model";
import { ILogTemperature } from "app/entities/log-temperature/log-temperature.model";
import { ILogVision } from "app/entities/log-vision/log-vision.model";
import { SensorType } from "app/entities/enumerations/sensor-type.model";

export interface IDevice {
  id?: number;
  description?: string | null;
  sensorType?: SensorType | null;
  macAddress?: string | null;
  status?: boolean | null;
  productionLine?: IProductionLine;
  notificationGroup?: INotificationGroup;
  logTemperatures?: ILogTemperature[] | null;
  logVisions?: ILogVision[] | null;
}

export class Device implements IDevice {
  constructor(
    public id?: number,
    public description?: string | null,
    public sensorType?: SensorType | null,
    public macAddress?: string | null,
    public status?: boolean | null,
    public productionLine?: IProductionLine,
    public notificationGroup?: INotificationGroup,
    public logTemperatures?: ILogTemperature[] | null,
    public logVisions?: ILogVision[] | null
  ) {
    this.status = this.status ?? false;
  }
}

export function getDeviceIdentifier(device: IDevice): number | undefined {
  return device.id;
}
