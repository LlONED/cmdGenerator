<template>
  <setting-item settingTitle="Опции">
    <option-configurable>
      <template #description>
        <span>Является ли команда персональной</span>
      </template>

      <template #option>
        <v-input-checkbox
          class="w-6 h-6"
          :checked="currentEvent.isCommandPersonal"
          @change="setCommandPersonal"
        />
      </template>
    </option-configurable>

    <option-configurable>
      <template #description>
        <span>Тип ивента</span>
      </template>

      <template #option>
        <v-input-select
          class="w-48"
          :options="Object.values(eventType)"
          :defaultOption="currentEvent.type"
          @input="setEventType"
        />
      </template>
    </option-configurable>

    <option-input
      description="Минут в периоде"
      v-if="currentEvent.type === eventType.Time"
    >
      <v-input-number
        :min="1"
        :value="currentEvent.minutesPerPeriod"
        @input="setMinutesPerPeriod"
      />
    </option-input>

    <option-input description="Дефолтное количество выдач">
      <v-input-number
        :value="defaultPrizeCount"
        :min="1"
        @input="setDefaultPrizeCount"
      />
    </option-input>

    <option-input description="Дефолтное количество коинов">
      <v-input-number
        :min="1"
        :value="currentEvent.coinsDefault"
        @input="setDefaultCoins"
      />
    </option-input>

    <option-input description="Команда выдачи">
      <v-input-text @input="setCommand" :value="command" />
    </option-input>

    <option-input description="Сепаратор аргументов">
      <v-input-text
        placeholder="сепаратор"
        :value="commandSeparator"
        @input="setCommandSeparator"
      />
    </option-input>

    <option-input description="Паттерн аргумента">
      <v-input-text
        class="w-full"
        :value="commandPattern"
        @input="setCommandPattern"
      />
    </option-input>
  </setting-item>
</template>

<script>
  import { eventType } from "@/types/event";

  import SettingItem from "@/components/Setting/SettingItem.vue";
  import OptionInput from "@/components/Setting/OptionInput.vue";
  import OptionConfigurable from "@/components/Setting/OptionConfigurable.vue";
  import { mapGetters, mapMutations } from "vuex";

  export default {
    components: {
      SettingItem,
      OptionInput,
      OptionConfigurable,
    },

    name: "TheOptions",

    computed: {
      ...mapGetters({
        currentPreset: "currentPreset",
        command: "command",
        commandSeparator: "commandSeparator",
        commandPattern: "commandPattern",
        defaultPrizeCount: "defaultPrizeCount",
      }),

      eventType() {
        return eventType;
      },

      currentEvent() {
        return this.currentPreset.events[this.currentPreset.currentEvent];
      },
    },

    methods: {
      ...mapMutations({
        updateCurrentPreset: "updateCurrentPreset",
        setDefaultPrizeCount: "setDefaultPrizeCount",
      }),

      setCommandPersonal(value) {
        this.updateCurrentPreset((preset) => {
          preset.events[preset.currentEvent].isCommandPersonal = value;
          return preset;
        });
      },

      setMinutesPerPeriod(value) {
        this.updateCurrentPreset((preset) => {
          preset.events[preset.currentEvent].minutesPerPeriod = +value;
          return preset;
        });
      },

      setEventType(value) {
        this.updateCurrentPreset((preset) => {
          preset.events[preset.currentEvent].type = value;
          return preset;
        });
      },

      setDefaultCoins(value) {
        this.updateCurrentPreset((preset) => {
          preset.events[preset.currentEvent].coinsDefault = +value;
          return preset;
        });
      },

      setCommandSeparator(value) {
        this.updateCurrentPreset((preset) => {
          if (preset.events[preset.currentEvent].commandSeparator !== "") {
            preset.events[preset.currentEvent].commandSeparator = value;
            return preset;
          }

          preset.commandSeparator = value;
          return preset;
        });
      },

      setCommandPattern(value) {
        this.updateCurrentPreset((preset) => {
          if (preset.events[preset.currentEvent].commandPattern !== "") {
            preset.events[preset.currentEvent].commandPattern = value;
            return preset;
          }

          preset.commandPattern = value;
          return preset;
        });
      },

      setCommand(value) {
        this.updateCurrentPreset((preset) => {
          if (preset.events[preset.currentEvent].command !== "") {
            preset.events[preset.currentEvent].command = value;
            return preset;
          }

          preset.command = value;
          return preset;
        });
      },
    },
  };
</script>
