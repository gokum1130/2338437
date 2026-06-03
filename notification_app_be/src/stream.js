const { sortByPriority, getPriorityWeight } = require("./priority");

const TOP_N = 10;

class NotificationStreamHandler {
  constructor(limit = TOP_N) {
    this.limit = limit;
    this.notifications = [];
    this._idCounter = 1;
    this.totalReceived = 0;
  }

  push(notification) {
    if (!notification?.type) {
      throw new Error("Notification must include a type");
    }

    this.totalReceived += 1;

    const entry = {
      id: notification.id ?? this._idCounter++,
      type: notification.type,
      message: notification.message ?? "",
      timestamp: notification.timestamp ?? new Date().toISOString(),
      weight: getPriorityWeight(notification.type),
    };

    this.notifications.push(entry);
    this.notifications = sortByPriority(this.notifications).slice(0, this.limit);

    return entry;
  }

  getTop10() {
    return [...this.notifications];
  }

  getStats() {
    return {
      totalReceived: this.totalReceived,
      held: this.notifications.length,
      limit: this.limit,
    };
  }
}

module.exports = NotificationStreamHandler;
