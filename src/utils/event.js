import { ITimes, timeType } from "@/types/time";

export function isEventActiveLogic(actions = ITimes.actions) {
  return actions.at(-1).type === timeType.Event;
}

export function eventCountLogic(actions = ITimes.actions) {
  return actions.filter((el) => el.type === timeType.Event).length;
}

export function eventTimeLastStart(actions = ITimes.actions) {
  actions = actions.filter((el) => el.type === timeType.Event);
  return actions.at(-1).start;
}
