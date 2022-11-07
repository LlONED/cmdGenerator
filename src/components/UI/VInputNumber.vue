<template>
  <input
    type="number"
    class="input__string"
    @input="updateInput"
    :value="value"
    :placeholder="placeholder"
    :min="min"
    :max="max"
  />
</template>

<script>
export default {
  name: "VInputNumber",

  emits: {
    input: null,
  },

  methods: {
    updateInput(event) {
      this.$emit("input", +event.target.value);
    },
  },

  props: {
    value: {
      type: Number,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    min: {
      type: Number,
      require: false,
    },
    max: {
      type: Number,
      require: false,
    },
  },
};
</script>