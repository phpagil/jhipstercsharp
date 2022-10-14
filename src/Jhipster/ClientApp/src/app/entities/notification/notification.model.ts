import { INotificationGroup } from "app/entities/notification-group/notification-group.model";

export interface INotification {
  id?: number;
  message?: string | null;
  statusReady?: boolean | null;
  statusSent?: boolean | null;
  notificationGroup?: INotificationGroup;
}

export class Notification implements INotification {
  constructor(
    public id?: number,
    public message?: string | null,
    public statusReady?: boolean | null,
    public statusSent?: boolean | null,
    public notificationGroup?: INotificationGroup
  ) {
    this.statusReady = this.statusReady ?? false;
    this.statusSent = this.statusSent ?? false;
  }
}

export function getNotificationIdentifier(
  notification: INotification
): number | undefined {
  return notification.id;
}
