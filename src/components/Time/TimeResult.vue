<template>
  <div class="flex flex-col gap-3">
    <time-action
      v-for="(action, i) in times.actions"
      :key="Math.floor(Math.random() * 10000000000)"
      :action="action"
      :online="onlineActions.all.arr[i]"
    />

    <p class="p-2 flex flex-col" v-if="this.onlineActions.events.ms > 100">
      <span>Онлайн ивентов: {{ formatedOnlineResult.events }}</span>
      <span>Общий онлайн: {{ formatedOnlineResult.all }}</span>
    </p>
  </div>
</template>

<script>
  import { onlineTimeActions, formatTimeRange } from "@/utils/time";

  import TimeAction from "@/components/Time/TimeAction.vue";

  export default {
    name: "TimeResult",

    components: {
      TimeAction,
    },

    props: {
      times: {
        type: Object,
        required: true,
      },
    },

    computed: {
      onlineActions() {
        return onlineTimeActions(this.times.actions);
      },

      formatedOnlineResult() {
        const online = this.onlineActions;

        return {
          events: formatTimeRange(online.events.ms),
          all: formatTimeRange(online.all.ms),
        };
      },
    },
  };
</script>
