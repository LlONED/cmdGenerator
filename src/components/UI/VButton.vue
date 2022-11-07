<template>
  <button
    type="button"
    class="text-white bg-zinc-700 hover:bg-zinc-600 border-none rounded"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "VButton",
};
</script>