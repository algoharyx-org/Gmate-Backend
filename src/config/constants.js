export const HTTP_STATUS = {
  OK: 200,
  CREATE: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  ON_HOLD: "on-hold",
  COMPLETED: "completed",
};

export const PROJECT_ROLE = {
  MANAGER: "manager",
  DEVELOPER: "developer",
  VIEWER: "viewer",
};

export const TASK_STATUS = {
  TODO: "to-do",
  IN_PROGRESS: "in-progress",
  REVIEW: "review",
  COMPLETED: "completed",
  IMPORTANT: "important",
  UPCOMING: "upcoming",
  OVERDUE: "overdue",
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "urgent",
};

export const NOTIFICATION_TYPE = {
  TASK_ASSIGNED: "task_assigned",
  TASK_OVERDUE: "task_overdue",
  TASK_COMMENT: "task_comment",
  PROJECT_MEMBER_ADDED: "project_member_added",
};
