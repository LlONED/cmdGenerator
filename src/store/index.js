import { createStore } from "vuex";
import { userAction, userStatus } from "@/types/user";
import { timeType, IPoint } from "@/types/time";
import { isEventActiveLogic, eventCountLogic } from "@/utils/event";
import { toggleActionTimeLogic, addPointsTimeLogic } from "@/utils/time";
import { formatCommadResult } from "@/utils/command";
import serversPreset from "@/serversPreset";
import { eventType } from "@/types/event";

export default createStore({
  state: () => ({
    /**
     * @property {number} _key - vue key
     * @property {string} id - discord id
     * @property {string} name - dicord name
     * @property {number} coins - user coins
     * @property {number} prizeCount - user prize count
     * @property {init | success | error} status - user status
     * @property {boolean} isActive - is user active
     * @property {{ actions: [{type: timeType, index: number,  [{action: userAction | eventTimeStatus}]}], online: number, eventIndex: number }} times - user join / leave time
     */
    users: [],
    eventsTime: {
      actions: [
        {
          type: timeType.Other,
          start: Date.now(),
          end: -1,
          index: -1,
          points: [],
        },
      ],
      online: 0,
    },
    currentServer: "default",
    presets: serversPreset,
    defaultCoins: 0,
    defaultPrizeCount: 1,
    updater: {
      functions: [],
      refreshTimer: 1000,
      interval: null,
    },
  }),

  getters: {
    users(state) {
      return state.users;
    },

    currentServer(state) {
      return state.currentServer;
    },

    currentPreset(state) {
      return state.presets[state.currentServer];
    },

    currentPresetEvent(state) {
      return state.presets[state.currentServer].events[
        state.presets[state.currentServer].currentEvent
      ];
    },

    activeUsers(state) {
      return state.users.filter((el) => el.isActive === true);
    },

    defaultCoins(state, getters) {
      return getters.currentPresetEvent.coinsDefault;
    },

    defaultPrizeCount(state) {
      return state.defaultPrizeCount;
    },

    isCommandPersonal(state, getters) {
      return getters.currentPresetEvent.isCommandPersonal;
    },

    command(state, getters) {
      return (
        getters.currentPresetEvent.command || getters.currentPreset.command
      );
    },
    commandPattern(state, getters) {
      return (
        getters.currentPresetEvent.commandPattern ||
        getters.currentPreset.commandPattern
      );
    },

    commandSeparator(state, getters) {
      return (
        getters.currentPresetEvent.commandSeparator ||
        getters.currentPreset.commandSeparator
      );
    },

    commandResult(state, getters) {
      return formatCommadResult({
        isCommandPersonal: getters.isCommandPersonal,
        command: getters.command,
        commandPattern: getters.commandPattern,
        commandSeparator: getters.commandSeparator,
        users: getters.activeUsers,
      });
    },

    servers(state) {
      return Object.keys(state.presets);
    },

    eventsTime(state) {
      return state.eventsTime;
    },

    eventCount(state) {
      return eventCountLogic(state.eventsTime.actions);
    },

    isEventActive(state) {
      return isEventActiveLogic(state.eventsTime.actions);
    },

    isUpdaterActive(state) {
      return state.updater.interval !== null;
    },
  },

  mutations: {
    updateUser(state, { _key = 0, update = (user) => user }) {
      state.users = state.users.map((user) =>
        user._key === _key ? update(user) : user
      );
    },

    updateUsers(state, update = (user) => user) {
      state.users = state.users.map((user) => update(user));
    },

    removeUser(state, _key = 0) {
      state.users = state.users.filter((user) => user._key !== _key);
    },

    addUser(
      state,
      {
        _key = Math.floor(Math.random() * 10000000),
        id = "",
        name = "",
        coins = state.presets[state.currentServer].events[
          state.presets[state.currentServer].currentEvent
        ].coinsDefault,
        prizeCount = state.defaultPrizeCount,
        status = userStatus.Init,
        isActive = false,
        times = {
          actions: [
            {
              type: isEventActiveLogic(state.eventsTime.actions)
                ? timeType.Event
                : timeType.Other,
              index: isEventActiveLogic(state.eventsTime.actions)
                ? eventCountLogic(state.eventsTime.actions) - 1
                : -1,
              start: Date.now(),
              end: -1,
              points: [
                {
                  ms: Date.now(),
                  action: userAction.Disabled,
                  isOnline: false,
                },
              ],
            },
          ],
          online: 0,
        },
      }
    ) {
      state.users.push({
        _key,
        id,
        name,
        coins,
        prizeCount,
        status,
        isActive,
        times,
      });
    },

    setCurrentServer(state, server = "") {
      state.currentServer = server;
    },

    setDefaultCoins(state, coin = 0) {
      state.defaultCoins = coin;
    },

    setDefaultPrizeCount(state, count = 0) {
      state.defaultPrizeCount = count;
    },

    updateCurrentPreset(state, update = (currentPreset) => currentPreset) {
      state.presets[state.currentServer] = update(
        state.presets[state.currentServer]
      );
    },

    updaterStart(state) {
      state.updater.interval = setInterval(() => {
        for (const func of state.updater.functions) {
          func();
        }
      }, state.updater.refreshTimer);
    },

    updaterStop(state) {
      if (state.updater.interval !== null) {
        clearInterval(state.updater.interval);
        state.updater.interval = null;
      }
    },

    updaterAddFunction(state, func = () => {}) {
      state.updater.functions.push(func);
    },

    eventActionToggle(state) {
      state.eventsTime = toggleActionTimeLogic(
        state.eventsTime,
        eventCountLogic(state.eventsTime.actions),
        isEventActiveLogic(state.eventsTime.actions)
      );
    },

    eventSetOnline(state, online = 0) {
      state.eventsTime.online = online;
    },

    addPointTimeEvent(state, actions = [IPoint.action]) {
      state.eventsTime = addPointsTimeLogic(state.eventsTime, actions);
    },
  },
  actions: {},
});
