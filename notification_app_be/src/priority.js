const NOTIFICATION_TYPES = {
  PLACEMENT: "placement",
  RESULT: "result",
  EVENT: "event",
};

// Placement > Result > Event
const NOTIFICATION_WEIGHTS = {
  [NOTIFICATION_TYPES.PLACEMENT]: 3,
  [NOTIFICATION_TYPES.RESULT]: 2,
  [NOTIFICATION_TYPES.EVENT]: 1,
};

function getPriorityWeight(type) {
  const weight = NOTIFICATION_WEIGHTS[type];

  if (weight === undefined) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  return weight;
}

function compareByPriority(a, b) {
  return getPriorityWeight(b.type) - getPriorityWeight(a.type);
}

function sortByPriority(notifications) {
  return [...notifications].sort(compareByPriority);
}

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_WEIGHTS,
  getPriorityWeight,
  compareByPriority,
  sortByPriority,
};
