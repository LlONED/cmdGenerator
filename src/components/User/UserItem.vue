<template>
  <li
    class="content-field flex flex-wrap flex-row justify-between list-none p-4 items-center"
  >
    <v-modal
      :modalTitle="modalTitle"
      :show="showModal"
      modalId="time"
      @close="closeModal"
    >
      <template #buttons>
        <v-button @click="copyTimeText(modalTitle)">копировать</v-button>
      </template>

      <template #body>
        <time-result ref="timeResult" :times="user.times" />
      </template>
    </v-modal>

    <div class="w-8 flex items-center">
      <span>{{ index }}</span>
    </div>

    <div class="flex flex-1 items-center">
      <div class="flex flex-wrap flex-[7] justify-between items-center gap-3">
        <v-input-text
          placeholder="имя"
          :value="user.name"
          @input="updateUserName"
        />

        <v-input-text
          placeholder="тег | id"
          :value="user.id"
          @input="updateUserId"
        />

        <v-input-number
          class="lg:w-28"
          placeholder="выдача"
          :min="1"
          :value="user.prizeCount"
          @input="updateUserPrizeCount"
        />

        <v-input-number
          class="lg:w-28"
          placeholder="коины"
          :min="0"
          :value="user.coins"
          @click="$event.target.select()"
          @input="updateUserCoins"
        />

        <div class="w-48 lg:w-40 flex justify-center">
          <span class="cursor-pointer" @click="openModal">{{
            formatedTimeTitle
          }}</span>
        </div>
      </div>

      <div
        class="flex flex-wrap flex-[1] lg:justify-end justify-center items-center gap-3"
      >
        <v-input-checkbox
          class="w-6 h-6"
          :checked="user.isActive"
          :disabled="user.id === ''"
          @change="toggleActiveTimes"
        />

        <v-button class="w-6 h-7" @click="removeUserEvent(user._key)"
          >-</v-button
        >
      </div>
    </div>
  </li>
</template>

<script>
  import CopyMixin from "@/mixins/copy";
  import ModalMixin from "@/mixins/modal";
  import { ITimes, timeType } from "@/types/time";
  import { userAction } from "@/types/user";
  import {
    addPointsTimeLogic,
    formatTimeRange,
    toggleActionTimeLogic,
  } from "@/utils/time";

  import TimeResult from "@/components/Time/TimeResult.vue";

  export default {
    name: "UserItem",

    components: {
      TimeResult,
    },

    emits: {
      removeUser: null,
      updateUser: null,
    },

    mixins: [CopyMixin, ModalMixin],

    props: {
      user: {
        type: Object,
        required: true,
      },

      index: {
        type: [String, Number],
        required: true,
      },

      eventCount: {
        type: Number,
        required: true,
      },

      isEventActive: {
        type: Boolean,
        required: true,
      },
    },

    methods: {
      toggleActiveTimes(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            if (
              value === true &&
              this.isEventActive === true &&
              this.user.times.actions.at(-1).type !== timeType.Event
            ) {
              user.times = toggleActionTimeLogic(
                this.user.times,
                this.eventCount - 1,
                false
              );
              user.isActive = true;
              return user;
            } else if (value === true) {
              user.times = addPointsTimeLogic(this.user.times, [
                userAction.Activated,
              ]);
              user.isActive = true;
              return user;
            } else {
              user.times = addPointsTimeLogic(this.user.times, [
                userAction.Disabled,
              ]);
              user.isActive = false;
              return user;
            }
          },
        });
      },

      updateUserName(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            user.name = value;
            return user;
          },
        });
      },

      updateUserId(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            user.id = value;
            return user;
          },
        });
      },

      updateUserCoins(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            user.coins = value;
            return user;
          },
        });
      },

      updateUserPrizeCount(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            user.prizeCount = value;
            return user;
          },
        });
      },

      updateUserActive(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            user.isActive = value;
            return user;
          },
        });
      },

      updateUserTimes(value) {
        this.$emit("updateUser", {
          _key: this.user._key,
          update: (user) => {
            user.times = value;
            return user;
          },
        });
      },

      removeUserEvent(_key) {
        this.$emit("removeUser", _key);
      },

      formatTimeLastJoin(actions = ITimes.actions) {
        let join = 0;

        x: for (let i = actions.length; i--; ) {
          const action = actions[i];
          for (const point of action.points) {
            if (
              point.action === userAction.Init ||
              point.action === userAction.Join ||
              point.action === userAction.Activated
            ) {
              join = point.ms;
              break x;
            }
          }
        }

        return join;
      },
    },

    computed: {
      modalTitle() {
        return `история активности ${
          this.user.name || this.user.id?.slice(0, 21) || "пользователя"
        }`;
      },

      formatedTimeTitle() {
        const times = this.user.times;
        const join = new Date(
          this.formatTimeLastJoin(times.actions) || times.actions.at(-1).start
        );

        if (times.online === 0) {
          return `${join.toLocaleTimeString()} 00:00:00`;
        }

        return `${join.toLocaleTimeString()} ${formatTimeRange(times.online, {
          isMs: false,
        })}`;
      },
    },

    watch: {
      "user.id"(value, oldValue) {
        if (value === "") this.toggleActiveTimes(false);
        else if (oldValue === "" && value !== "") this.toggleActiveTimes(true);
      },
    },
  };
</script>
