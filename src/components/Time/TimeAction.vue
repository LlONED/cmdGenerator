<template>
  <p class="flex flex-col gap-3 p-2 ">
    <h2 class="">{{ actionTitle }}</h2>

    <ul v-if="action.points.length !== 0">
        <time-point
            v-for="point in action.points"
            :point="point"
            :key="Math.floor(Math.random() * 10000000000)"
        />
    </ul>
  </p>
</template>

<script>
  import { timeType } from "@/types/time";
  import { formatTimeRange } from "@/utils/time";

  import TimePoint from "@/components/Time/TimePoint.vue";

  export default {
    name: "TimeAction",

    components: {
      TimePoint,
    },

    props: {
      action: {
        type: Object,
        required: true,
      },

      online: {
        type: Number,
        required: true,
      },
    },

    computed: {
      actionTitle() {
        const action = this.action;
        const online = this.online;
        const startDate = new Date(action.start);
        const startDateString = startDate.toLocaleDateString()
        const endDate = new Date(action.end);
        const endDateString = endDate.toLocaleDateString()

        let startEnd =
          action.end === -1
            ? `${startDate.toLocaleTimeString()} - текущий момент`
            : `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()} (${formatTimeRange(
                online
              )})`;

        return `${
          action.type === timeType.Event
            ? `${action.index + 1}-й ивент`
            : "перерыв"
        } ${action.end !== -1 && startDateString !== endDateString ? `${startDateString} - ${endDateString}` : startDateString}: ${startEnd}`;
      },
    },
  };
</script>
