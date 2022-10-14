import dayjs from "dayjs/esm";
import { IDevice } from "app/entities/device/device.model";
import { Status } from "app/entities/enumerations/status.model";

export interface ILogTemperature {
  id?: number;
  createdAt?: dayjs.Dayjs | null;
  temperature?: number | null;
  status?: Status | null;
  device?: IDevice;
}

export class LogTemperature implements ILogTemperature {
  constructor(
    public id?: number,
    public createdAt?: dayjs.Dayjs | null,
    public temperature?: number | null,
    public status?: Status | null,
    public device?: IDevice
  ) {}
}

export function getLogTemperatureIdentifier(
  logTemperature: ILogTemperature
): number | undefined {
  return logTemperature.id;
}
