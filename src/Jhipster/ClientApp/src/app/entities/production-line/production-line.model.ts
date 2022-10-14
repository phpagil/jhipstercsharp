import dayjs from "dayjs/esm";
import { IDevice } from "app/entities/device/device.model";

export interface IProductionLine {
  id?: number;
  description?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  devices?: IDevice[] | null;
}

export class ProductionLine implements IProductionLine {
  constructor(
    public id?: number,
    public description?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public updatedAt?: dayjs.Dayjs | null,
    public devices?: IDevice[] | null
  ) {}
}

export function getProductionLineIdentifier(
  productionLine: IProductionLine
): number | undefined {
  return productionLine.id;
}
