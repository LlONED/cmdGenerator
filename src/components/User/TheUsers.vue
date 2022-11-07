<template>
  <div
    ref="users"
    class="cnt-block flex-[12] overflow-y-scroll overflow-x-hidden p-[10px] flex-col items-center rounded-lg scrollbar"
  >
    <UsersList
      :users="users"
      @removeUser="removeUser"
      @updateUser="updateUser"
    />

    <v-button @click="addUserAndUpdateScroll()" class="px-3 py-2 mt-2"
      >+</v-button
    >
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import UsersList from "@/components/User/TheUsersList.vue";

  export default {
    name: "TheUsers",
    components: {
      UsersList,
    },

    computed: {
      ...mapGetters({
        users: "users",
      }),
    },

    methods: {
      ...mapMutations({
        addUser: "addUser",
        updateUser: "updateUser",
        removeUser: "removeUser",
      }),

      scrollBottom() {
        this.$nextTick(() => {
          const scrollHeight = this.$refs.users.scrollHeight;
          const clientHeight = this.$refs.users.clientHeight;

          if (scrollHeight > clientHeight) {
            this.$refs.users.scrollTop = scrollHeight;
          }
        });
      },

      addUserAndUpdateScroll() {
        this.addUser({});
        this.scrollBottom();
      },
    },

    mounted() {
      this.addUser({});
    },
  };
</script>
