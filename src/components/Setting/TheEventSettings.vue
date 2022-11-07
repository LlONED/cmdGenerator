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
        <v-button class="p-2" @click="eventTimeToggle">
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
  } from "@/utils/time";

  import CopyMixin from "@/mixins/copy";

  import SettingItem from "@/components/Setting/SettingItem.vue";
  import OptionModal from "@/components/Setting/OptionModal.vue";
  import OptionConfigurable from "@/components/Setting/OptionConfigurable.vue";
  import TimeResult from "@/components/Time/TimeResult.vue";

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
        eventActionToggle: "eventActionToggle",
        eventSetOnline: "eventSetOnline",
      }),

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
        servers: "servers",
        isEventActive: "isEventActive",
        eventsTime: "eventsTime",
        eventCount: "eventCount",
        isUpdaterActive: "isUpdaterActive",
      }),

      eventKeys() {
        return Object.keys(this.currentPreset.events);
      },

      formatedTime() {
        return formatTimeActions(this.eventsTime.actions);
      },

      formatedTitleTime() {
        const times = this.eventsTime;
        const event =
          times.actions.length === 1
            ? undefined
            : times.actions.at(-1).type === timeType.Event
            ? times.actions.at(-1)
            : times.actions.at(-2);

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
          if (user.isActive)
            user.times.online = onlineTimeActions(user.times.actions).events.ms;
          return user;
        });
      });

      this.updaterAddFunction(() => {
        this.eventSetOnline(onlineTimeLastEvent(this.eventsTime.actions));
      });
    },
  };
</script>
