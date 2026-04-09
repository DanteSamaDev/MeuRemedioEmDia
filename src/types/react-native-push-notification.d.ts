declare module 'react-native-push-notification' {
  interface PushNotificationObject {
    alert?: string;
    message?: string;
    title?: string;
    ticker?: string;
    bigText?: string;
    subText?: string;
    soundName?: string;
    playSound?: boolean;
    vibrate?: boolean | number[];
    tag?: string;
    group?: string;
    groupSummary?: boolean;
    ongoing?: boolean;
    priority?: 'max' | 'high' | 'low' | 'min' | 'default';
    visibility?: 'public' | 'private' | 'secret';
    ignoreInForeground?: boolean;
    onNotification?: (notification: PushNotificationObject) => void;
    onRegister?: (token: { os: string; token: string }) => void;
    onAction?: (action: string) => void;
    invokeApp?: boolean;
    [key: string]: any;
  }

  interface PushNotificationScheduleObject extends PushNotificationObject {
    date: Date;
    allowWhileIdle?: boolean;
    repeatType?: 'week' | 'day' | 'time';
    repeatTime?: number;
  }

  namespace PushNotification {
    function configure(options: any): void;
    function localNotification(notification: PushNotificationObject): void;
    function localNotificationSchedule(notification: PushNotificationScheduleObject): void;
    function cancelLocalNotifications(userInfo: any): void;
    function cancelAllLocalNotifications(): void;
    function removeAllDeliveredNotifications(): void;
    function getChannels(callback: (channel_ids: string[]) => void): void;
    function createChannel(details: any, success?: () => void, failure?: () => void): void;
    function channelExists(channel_id: string, callback: (exists: boolean) => void): void;
    function deleteChannel(channel_id: string): void;
    function channelBlocked(channel_id: string, callback: (blocked: boolean) => void): void;
    function setVolume(volume: number): void;
  }

  const PushNotification: typeof PushNotification;
  export default PushNotification;
}
