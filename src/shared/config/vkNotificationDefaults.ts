export type VkNotificationSettings = {
  enabledBosses: string[];
  defaultNotifyBeforeMinutes: number;
  notifyMinutesByEvent: Record<string, number>;
  quietHoursEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
  primeTime: string | null;
};

export const PRIME_EVENT_NAME = "Прайм";

export const DEFAULT_VK_NOTIFICATION_SETTINGS: VkNotificationSettings = {
  enabledBosses: ["Марли", "Морф"],
  defaultNotifyBeforeMinutes: 10,
  notifyMinutesByEvent: {},
  quietHoursEnabled: true,
  quietHoursStart: 2,
  quietHoursEnd: 7,
  primeTime: null,
};

export function resolveNotifyMinutes(
  settings: VkNotificationSettings,
  eventName: string,
): number {
  return (
    settings.notifyMinutesByEvent[eventName] ??
    settings.defaultNotifyBeforeMinutes
  );
}
