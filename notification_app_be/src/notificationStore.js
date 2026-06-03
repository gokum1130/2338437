const { sortByPriority, getPriorityWeight, NOTIFICATION_TYPES } = require("./priority");

const SEED_DATA = [
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Amazon SDE offer — congratulations!" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Microsoft internship offer released" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Google placement offer confirmed" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Flipkart offer letter available" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Mid-semester grades published" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Assignment scores updated on portal" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Lab viva results declared" },
  { type: NOTIFICATION_TYPES.RESULT, message: "End-semester results are out" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Tech talk at 4 PM — Hall A" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Hackathon registration closes tonight" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Guest lecture rescheduled to Friday" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Sports day schedule posted" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Library extended hours this week" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Cultural fest starts tomorrow" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Fee payment reminder — due Friday" },
  { type: NOTIFICATION_TYPES.RESULT, message: "Supplementary exam form open" },
  { type: NOTIFICATION_TYPES.PLACEMENT, message: "Infosys placement drive next Monday" },
  { type: NOTIFICATION_TYPES.EVENT, message: "Workshop on cloud computing — register now" },
];

class NotificationStore {
  constructor() {
    this.notifications = [];
    this._idCounter = 1;
    this.seed();
  }

  seed() {
    if (this.notifications.length > 0) {
      return;
    }
    SEED_DATA.forEach((item) => this.add(item));
  }

  add({ type, message, timestamp, read = false }) {
    const entry = {
      id: this._idCounter++,
      type,
      message: message ?? "",
      timestamp: timestamp ?? new Date().toISOString(),
      weight: getPriorityWeight(type),
      read: Boolean(read),
    };
    this.notifications.push(entry);
    return entry;
  }

  list({ page = 1, limit = 10, notification_type } = {}) {
    let items = sortByPriority([...this.notifications]);

    if (notification_type && notification_type !== "all") {
      items = items.filter((n) => n.type === notification_type);
    }

    const total = items.length;
    const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 100));
    const safePage = Math.max(1, Number(page) || 1);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const currentPage = Math.min(safePage, totalPages);
    const start = (currentPage - 1) * safeLimit;
    const data = items.slice(start, start + safeLimit);

    return {
      data,
      pagination: {
        page: currentPage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  setReadState(id, read) {
    const item = this.notifications.find((n) => n.id === Number(id));
    if (!item) {
      return null;
    }
    item.read = Boolean(read);
    return item;
  }

  getById(id) {
    return this.notifications.find((n) => n.id === Number(id)) ?? null;
  }
}

module.exports = NotificationStore;
