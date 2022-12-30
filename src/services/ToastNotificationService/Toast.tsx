import { notification } from "antd";

export class Toast {
    static success(title: string, message?: string) {
        notification.success({
            message: title,
            description: message
        });
    }

    static error(title: string, message?: string) {
        notification.error({
            message: title,
            description: message,
        });
    }

    static info(title: string, message?: string) {
        notification.info({
            message: title,
            description: message,
        });
    }
}