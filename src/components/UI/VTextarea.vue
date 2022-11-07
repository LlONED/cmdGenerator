<template>
  <textarea
    class="resize-none bg-zinc-900 rounded-md px-2 py-3 scrollbar"
    :placeholder="placeholder"
    :value="value"
  ></textarea>
</template>

<script>
export default {
  name: "VTextarea",

  props: {
    value: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },
  },
};
</script>