import { eventType, eventName } from "@/types/event";

function eventDefaultPreset({
  coinsDefault = 0,
  minutesPerPeriod = 1,
  coinsPerPeriod = 0,
  isCommandPersonal = false,
  commandPattern = "",
  commandSeparator = "",
  command = "",
  matchCase = [],
  type = eventType.Raiting,
}) {
  return {
    coinsDefault,
    minutesPerPeriod,
    coinsPerPeriod,
    isCommandPersonal,
    commandPattern,
    commandSeparator,
    command,
    matchCase,
    type,
  };
}

function serverDefaultPreset({
  id = "",
  commandPattern = "%user% %count%",
  commandSeparator = " ",
  command = "/give",
  currentEvent = eventName.Default,
  events = {
    [eventName.Default]: eventDefaultPreset({}),
    [eventName.Default_10]: eventDefaultPreset({
      coinsDefault: 10,
      matchCase: ["свояк", "своя игра", "codenames", "пазлы"],
    }),
  },
}) {
  return {
    id,
    commandPattern,
    commandSeparator,
    command,
    currentEvent,
    events,
  };
}

export default {
  default: serverDefaultPreset({}),

  lounge: serverDefaultPreset({
    id: "254958490676625408",
    commandPattern: "пользователь%i1%:%user% количество%i1%:%count%",
    command: "/event prize",
    events: {
      [eventName.Default]: eventDefaultPreset({}),
      [eventName.Default_10]: eventDefaultPreset({
        coinsDefault: 10,
        matchCase: ["свояк", "своя игра", "codenames", "пазлы"],
      }),
      [eventName.Default_close]: eventDefaultPreset({
        type: eventType.Time,
        minutesPerPeriod: 20,
        coinsPerPeriod: 10,
        isCommandPersonal: true,
        commandPattern: "пользователь:%user% количество:%count%",
        command: "/give",
        matchCase: ["close", "клоз"],
      }),
      [eventName.Film]: eventDefaultPreset({
        type: eventType.Time,
        minutesPerPeriod: 20,
        coinsPerPeriod: 10,
        matchCase: ["смотр", "фильм"],
      }),
      [eventName.DBD_pub_close]: eventDefaultPreset({
        type: eventType.Time,
        minutesPerPeriod: 20,
        coinsPerPeriod: 10,
        isCommandPersonal: true,
        commandPattern: "пользователь:%user% количество:%count%",
        command: "/give",
        matchCase: ["dbd pub"],
      }),
      [eventName.DBD_full_close]: eventDefaultPreset({
        coinsDefault: 10,
        isCommandPersonal: true,
        commandPattern: "пользователь:%user% количество:%count%",
        command: "/give",
        matchCase: ["dbd"],
      }),
    },
  }),

  meta: serverDefaultPreset({
    id: "822354240713261068",
  }),

  hinomaru: serverDefaultPreset({
    id: "965383061749522502",
  }),

  futurama: serverDefaultPreset({
    id: "531970658633252864",
  }),

  heligate: serverDefaultPreset({
    id: "1001139842131955752",
  }),

  tenderly: serverDefaultPreset({
    id: "457902248660434944",
  }),

  hatory: serverDefaultPreset({
    id: "894663985650081864",
  }),
};
