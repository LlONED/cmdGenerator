<template>
  <div class="content-field p-2.5">
    <div
      class="w-full flex flex-wrap items-center gap-2 justify-center lg:justify-between"
    >
      <slot name="description"></slot>
      <slot name="option"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OptionConfigurable",
  };
</script>
