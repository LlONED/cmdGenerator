<template>
  <div class="content-field p-2.5">
    <label
      class="
        w-full
        flex flex-wrap
        items-center
        gap-2
        justify-center
        lg:justify-between
      "
    >
      <span>{{ description }}</span>
      <slot></slot>
    </label>
  </div>
</template>

<script>
export default {
  name: "OptionInput",

  props: {
    description: {
      type: String,
      required: true,
    },
  },
};
</script>