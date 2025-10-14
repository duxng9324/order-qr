import { useState } from "react";

type NotificationType = "success" | "error";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType = "success", duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  };

  const NotificationComponent = () => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`
            px-6 py-4 rounded shadow-lg text-white
            animate-slide-in
            ${n.type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {n.message}
        </div>
      ))}
    </div>
  );

  return { showNotification, NotificationComponent };
}
