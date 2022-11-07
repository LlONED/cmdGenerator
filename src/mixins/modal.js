export default {
    data() {
        return {
            showModal: false
        }
    },

    methods: {
        openModal() {
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
        },
    }
}