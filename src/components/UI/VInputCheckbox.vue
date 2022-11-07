<template>
  <label class="relative cursor-pointer">
    <input
      :disabled="disabled"
      type="checkbox"
      class="input__checkbox appearance-none absolute z-0 top-0 left-0 right-0 bottom-0 focus-visible:outline-offset-1"
      :checked="checked"
      @change="onChange"
    />
    <span class="w-full h-full bg-red-700 absolute rounded"></span>
  </label>
</template>

<script>
  export default {
    name: "VInputCheckbox",
    emits: {
      change: null,
    },

    props: {
      checked: {
        type: Boolean,
        default: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      onChange(event) {
        this.$emit("change", event.target.checked);
      },
    },
  };
</script>
