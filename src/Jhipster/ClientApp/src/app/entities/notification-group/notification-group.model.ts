import { IDevice } from "app/entities/device/device.model";
import { INotification } from "app/entities/notification/notification.model";

export interface INotificationGroup {
  id?: number;
  description?: string | null;
  devices?: IDevice[] | null;
  notifications?: INotification[] | null;
}

export class NotificationGroup implements INotificationGroup {
  constructor(
    public id?: number,
    public description?: string | null,
    public devices?: IDevice[] | null,
    public notifications?: INotification[] | null
  ) {}
}

export function getNotificationGroupIdentifier(
  notificationGroup: INotificationGroup
): number | undefined {
  return notificationGroup.id;
}
