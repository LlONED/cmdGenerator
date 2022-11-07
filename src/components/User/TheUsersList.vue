<template>
  <ol class="flex flex-col w-full gap-3">
    <user-item
      v-for="user in users"
      :key="user._key"
      :user="user"
      :index="activeUsers.findIndex((el) => el._key === user._key) + 1 || '#'"
      :eventCount="eventCount"
      :isEventActive="isEventActive"
      @updateUser="updateUserEvent"
      @removeUser="removeUserEvent"
    />
  </ol>
</template>

<script>
  import UserItem from "@/components/User/UserItem.vue";
  import { mapGetters } from "vuex";

  export default {
    name: "UsersList",

    emits: {
      removeUser: null,
      updateUser: null,
    },

    components: {
      UserItem,
    },

    props: {
      users: {
        type: Array,
        reqire: true,
      },
    },

    methods: {
      updateUserEvent(options) {
        this.$emit("updateUser", options);
      },

      removeUserEvent(_key) {
        this.$emit("removeUser", _key);
      },
    },

    computed: {
      ...mapGetters({
        activeUsers: "activeUsers",
        isEventActive: "isEventActive",
        eventCount: "eventCount",
      }),
    },
  };
</script>
