import { createStore } from "vuex";

const store = createStore({
  state: {
    messages: [],
    PlayerName: localStorage.getItem("PlayerName"),
    users: [],
    message: null,
    socket :{}
  },
  getters: {
    PlayerName(state) {
      return state.PlayerName;
    },
  },
});

export default store;
