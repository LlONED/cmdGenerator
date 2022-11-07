<template>
  <li class="w-full flex flex-col gap-2">
    <h1 class="text-center text-lg font-bold">{{ settingTitle }}</h1>
    <slot></slot>
  </li>
</template>

<script>
  export default {
    name: "SettingItem",

    props: {
      settingTitle: {
        type: String,
        required: true,
      },
    },
  };
</script>
