import { IAction, timeType, ITimes, IPoint } from "@/types/time";
import { userAction } from "@/types/user";

function isOnlineTimePointAction(action = IPoint.action) {
  switch (action) {
    case userAction.Leave: {
      return false;
    }

    case userAction.Join: {
      return true;
    }

    case userAction.Disabled: {
      return false;
    }

    case userAction.Activated: {
      return true;
    }
  }
}

export function formatTimeRange(ms = 0, options = { isMs: true }) {
  let seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  seconds = Math.floor(seconds % 3600);
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  ms = options.isMs ? ":" + ms.toString().slice(-3) : "";

  return `${hours > 9 ? hours : "0" + hours}:${
    minutes > 9 ? minutes : "0" + minutes
  }:${seconds > 9 ? seconds : "0" + seconds}${ms}`;
}

export function onlineTimeLastEvent(actions = ITimes.actions) {
  return onlineTimeAction(actions.at(-1));
}

export function onlineTimeAction(action = IAction) {
  let online =
    action.end === -1 ? Date.now() - action.start : action.end - action.start;
  let offlineTime = 0;
  let lastOfflineTime = 0;

  for (let i = 0; i < action.points.length; i++) {
    const point = action.points[i];
    const prevPoint = action.points[i - 1];

    if (point.isOnline !== prevPoint?.isOnline) {
      if (point.isOnline === false) lastOfflineTime = point.ms;
      else if (point.isOnline === true && lastOfflineTime !== 0)
        offlineTime += point.ms - lastOfflineTime;
    }
  }

  return online - offlineTime;
}

export function onlineTimeActions(actions = ITimes.actions) {
  let allActionsTime = {
    arr: [],
    ms: 0,
  };
  let allEventsTime = {
    arr: [],
    ms: 0,
  };

  for (const action of actions) {
    const online = onlineTimeAction(action);
    allActionsTime.ms += online;
    allActionsTime.arr.push(online);

    if (action.type === timeType.Event) {
      allEventsTime.ms += online;
      allEventsTime.arr.push(online);
    }
  }

  return {
    all: allActionsTime,
    events: allEventsTime,
  };
}

export function toggleActionTimeLogic(
  times = ITimes,
  eventCount = 0,
  isEventActive = false
) {
  const actions = [...times.actions];
  const lastEvent = actions.at(-1);

  lastEvent.end = Date.now();

  actions.push({
    type: isEventActive ? timeType.Other : timeType.Event,
    index: isEventActive ? -1 : eventCount,
    start: Date.now(),
    end: -1,
    points: [],
  });

  return { actions, online: times.online };
}

// prettier-ignore
export function addPointsTimeLogic(times = ITimes, pointActions = [IPoint.action]) {
  let actions = [...times.actions];
  const lastAction = actions.at(-1);

  for (let action of pointActions) {
    const point = {
      isOnline: isOnlineTimePointAction(action),
      action: action,
      ms: Date.now()
    }

    lastAction.points.push(point);
  }


  return { actions, online: times.online };
}

export function eventsEndToggleLogic(times = ITimes, isEventsStopped = false) {
  if (isEventsStopped === true) {
    times.actions = [
      ...times.actions,
      {
        type: timeType.Other,
        index: -1,
        start: Date.now(),
        end: -1,
        points: [],
      },
    ];
    return times;
  }

  times.actions.at(-1).end = Date.now();
  return times;
}
