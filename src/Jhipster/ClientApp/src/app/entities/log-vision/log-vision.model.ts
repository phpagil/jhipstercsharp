import dayjs from "dayjs/esm";
import { IDevice } from "app/entities/device/device.model";
import { Status } from "app/entities/enumerations/status.model";

export interface ILogVision {
  id?: number;
  createdAt?: dayjs.Dayjs | null;
  imagePath?: string | null;
  status?: Status | null;
  device?: IDevice;
}

export class LogVision implements ILogVision {
  constructor(
    public id?: number,
    public createdAt?: dayjs.Dayjs | null,
    public imagePath?: string | null,
    public status?: Status | null,
    public device?: IDevice
  ) {}
}

export function getLogVisionIdentifier(
  logVision: ILogVision
): number | undefined {
  return logVision.id;
}
