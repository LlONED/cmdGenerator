<template>
  <input
    :type="hidden ? 'password' : 'text'"
    :placeholder="placeholder"
    @input="updateInput"
    class="input__string"
  />
</template>

<script>
  export default {
    name: "VInputText",

    emits: {
      input: null,
    },

    methods: {
      updateInput(event) {
        this.$emit("input", event.target.value);
      },
    },

    props: {
      placeholder: {
        type: String,
        default: "",
      },

      hidden: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
