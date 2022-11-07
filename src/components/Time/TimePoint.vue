<template>
  <li class="flex items-center text-sm list-mark">
    <span
      ><span class="appearance-none opacity-0 w-0 h-0"> &bull; </span
      >{{ formatedPoint }}
    </span>
  </li>
</template>

<script>
  export default {
    name: "TimePoint",

    props: {
      point: {
        type: Object,
        required: true,
      },
    },

    computed: {
      formatedPoint() {
        const point = this.point;
        const time = new Date(point.ms);

        return `${time.toLocaleTimeString()} | ${point.action}`;
      },
    },
  };
</script>
