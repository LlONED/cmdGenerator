<template>
  <div :class="className"></div>
</template>

<script>
export default {
  name: "VStatus",

  props: {
    status: {
      type: String,
      require: true,
    },
  },

  computed: {
    className() {
      const statusPreset = {
        init: "hidden",
        loading: "bg-orange-700",
        success: "bg-green-700",
        error: "bg-red-700",
      };

      return `rounded-full ${statusPreset[this.status]}`;
    },
  },
};
</script>