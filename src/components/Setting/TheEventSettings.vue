<template>
  <setting-item settingTitle="Настройка ивента">
    <option-modal modalTitle="История активности ивентов" modalId="time">
      <template #description>
        {{ formatedTitleTime }}
      </template>

      <template #buttons>
        <v-button @click="copyTimeText('История активности ивентов')"
          >копировать</v-button
        >
      </template>

      <template #body>
        <time-result ref="timeResult" :times="eventsTime" />
      </template>

      <template #options>
        <v-button
          class="p-2"
          @click="allEventsEndToggle"
          v-if="isEventActive === false"
        >
          {{ isEventsStopped ? "начать" : "завершить" }}
        </v-button>

        <v-button
          class="p-2"
          @click="eventTimeToggle"
          v-if="isEventsStopped === false"
        >
          {{ isEventActive ? "стоп" : "старт" }}
        </v-button>
      </template>
    </option-modal>

    <option-configurable>
      <template #description>
        <v-input-text
          placeholder="id сервера"
          :value="currentPreset.id"
          @input="setServerId"
          class="w-1/2"
        />
      </template>

      <template #option>
        <v-input-select
          class="w-48"
          :options="servers"
          :defaultOption="currentServer"
          @input="setCurrentServer"
        />
      </template>
    </option-configurable>

    <option-configurable v-if="eventKeys.length > 1">
      <template #description>
        <span>Выбор ивента</span>
      </template>

      <template #option>
        <v-input-select
          class="w-48"
          :options="eventKeys"
          :defaultOption="currentPreset.currentEvent"
          @input="setCurrentEvent"
        />
      </template>
    </option-configurable>
  </setting-item>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import { timeType } from "@/types/time";
  import {
    formatTimeRange,
    onlineTimeActions,
    onlineTimeLastEvent,
    toggleActionTimeLogic,
    eventsEndToggleLogic,
  } from "@/utils/time";

  import CopyMixin from "@/mixins/copy";

  import SettingItem from "@/components/Setting/SettingItem.vue";
  import OptionModal from "@/components/Setting/OptionModal.vue";
  import OptionConfigurable from "@/components/Setting/OptionConfigurable.vue";
  import TimeResult from "@/components/Time/TimeResult.vue";
  import { eventType } from "@/types/event";

  export default {
    components: {
      SettingItem,
      OptionModal,
      OptionConfigurable,
      TimeResult,
    },

    name: "TheEventSettings",

    mixins: [CopyMixin],

    methods: {
      ...mapMutations({
        setCurrentServer: "setCurrentServer",
        updateCurrentPreset: "updateCurrentPreset",
        updateUsers: "updateUsers",
        updaterStart: "updaterStart",
        updaterStop: "updaterStop",
        updaterAddFunction: "updaterAddFunction",
        eventsEndToggle: "eventsEndToggle",
        eventActionToggle: "eventActionToggle",
        eventSetOnline: "eventSetOnline",
      }),

      allEventsEndToggle() {
        const isEventsStopped = this.isEventsStopped;
        this.eventsEndToggle(isEventsStopped);
        this.updateUsers((user) => {
          user.times = eventsEndToggleLogic(user.times, isEventsStopped);
          return user;
        });
      },

      setServerId(value) {
        this.updateCurrentPreset((preset) => {
          preset.id = value;

          return preset;
        });
      },

      eventStart() {
        this.updateUsers((user) => {
          if (user.isActive)
            user.times = toggleActionTimeLogic(
              user.times,
              this.eventCount,
              this.isEventActive
            );
          return user;
        });
        this.eventSetOnline(1);
        this.eventActionToggle();
        this.updaterStart();
      },

      eventStop() {
        this.updateUsers((user) => {
          if (
            user.isActive ||
            user.times.actions.at(-1).type === timeType.Event
          )
            user.times = toggleActionTimeLogic(
              user.times,
              this.eventCount,
              this.isEventActive
            );
          return user;
        });
        this.eventActionToggle();
        this.updaterStop();
      },

      eventTimeToggle() {
        this.isEventActive ? this.eventStop() : this.eventStart();
      },

      eventUpdaterToggle() {
        this.isUpdaterActive ? this.updaterStop() : this.updaterStart();
      },

      setCurrentEvent(value) {
        this.updateCurrentPreset((preset) => {
          preset.currentEvent = value;
          return preset;
        });
      },
    },

    computed: {
      ...mapGetters({
        currentServer: "currentServer",
        currentPreset: "currentPreset",
        currentPresetEvent: "currentPresetEvent",
        servers: "servers",
        eventsTime: "eventsTime",
        eventCount: "eventCount",
        isEventActive: "isEventActive",
        isEventsStopped: "isEventsStopped",
        isUpdaterActive: "isUpdaterActive",
      }),

      eventKeys() {
        return Object.keys(this.currentPreset.events);
      },

      formatedTime() {
        return formatTimeActions(this.eventsTime.actions);
      },

      formatedTitleTime() {
        if (this.isEventsStopped === true)
          return 'Нажмите "начать" для начала перерыва';

        const times = this.eventsTime;
        const event = times.actions.find((el) => el.type === timeType.Event);

        if (event === undefined) {
          return 'Нажмите "старт" для начала ивента';
        }

        // prettier-ignore
        const startTime = (new Date(event.start)).toLocaleTimeString();

        return `${startTime} ` + formatTimeRange(times.online, { isMs: false });
      },
    },

    created() {
      this.updaterAddFunction(() => {
        this.updateUsers((user) => {
          if (user.isActive) {
            user.times.online = onlineTimeActions(user.times.actions).events.ms;

            if (this.currentPresetEvent.type === eventType.Time) {
              const minutes = user.times.online / 1000 / 60;
              user.coins =
                Math.floor(minutes / this.currentPresetEvent.minutesPerPeriod) *
                this.currentPresetEvent.coinsPerPeriod;
            }
          }
          return user;
        });
      });

      this.updaterAddFunction(() => {
        this.eventSetOnline(onlineTimeLastEvent(this.eventsTime.actions));
      });
    },
  };
</script>
