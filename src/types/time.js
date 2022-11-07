import { eventTimeStatus } from "@/types/event";
import { userAction } from "@/types/user";

export const timeType = {
  Event: "Event",
  Other: "Other",
};

export const IPoint = {
  isOnline: true,
  ms: 0,
  action: Object.assign({}, userAction, eventTimeStatus),
};

export const IAction = {
  type: timeType,
  start: 0,
  end: -1,
  index: -1,
  points: [IPoint] || [],
};

export const ITimes = {
  actions: [IAction],
  online: 0,
};
