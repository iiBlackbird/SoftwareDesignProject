export enum NotificationType {
  ASSIGNMENT = 'assignment',
  UPDATE = 'update',
  REMINDER = 'reminder'
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  userId: number;
  eventId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
}