
<script>
import io from "socket.io-client";
import Othersvg from "@/components/Other-svg.vue";
import gsap from "gsap";

export default {
  components: {
    Othersvg,
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },

  methods: {
    ShowLeftBar() {
      if (this.leftbar == true) {
        this.leftbar = false;
        gsap.to("#leftbar", { duration: 0.1, x: "-305", y: 0, ease: "power2" });
      } else if (this.leftbar == false) {
        this.leftbar = true;
        gsap.to("#leftbar", { duration: 0.1, x: "0", y: 0, ease: "power2" });
      }
    },

    sendMessage() {
      if (this.$store.state.messages != "") {
        var info = {
          sender: this.$store.state.PlayerName,
          message: this.$store.state.message,
        };
        this.$store.state.socket.emit("sendmessageclient", info);
        // Return Messages on server
        this.$store.state.socket.on("messagesserver", (messages) => {
          this.$store.state.messages = messages;
        });
        this.$store.state.message = "";
        this.SlideMsgBox();
      }
    },
  },
  mounted() {
    this.$store.state.socket = io("http://178.193.216.170:3333/");

    this.$store.state.socket.on("messagesserver", (data) => {
      this.$store.messages = data;
    });

    this.$store.state.socket.on("Notification", () => {
      this.SlideMsgBox();
      var NtfMsg = gsap.timeline({ repeat: 5 });
      NtfMsg.to("#chat", {
        backgroundColor: "#26123e",
        duration: 0.1,
      });
      NtfMsg.to("#chat", {
        backgroundColor: "#B42B51",
        duration: 0.1,
      });
      NtfMsg.to("#chat", {
        backgroundColor: "#26123e",
        duration: 0.1,
      });
    });
  },
};
</script>
<template>
  <div id="leftbar">
    <div id="ChatHead">#General</div>
    <button id="chat" @click="ShowLeftBar()">
      <Othersvg name="chat" />
    </button>
    <form @submit.prevent="sendMessage">
      <div id="MessagesPlayers">
        <ul>
          <li v-for="(message, index) in messages" :key="index">
            <div
              style="background: rgb(38 18 62)"
              v-if="message.sender == PlayerName"
            >
              {{ message.message }}
            </div>
            <div v-else>
              <strong style="color: #b996f7"
                >{{ message.sender }}:&nbsp;
              </strong>
              {{ message.message }}
            </div>
          </li>
        </ul>
      </div>
      <input
        maxlength="100"
        type="text"
        placeholder="Message"
      />
    </form>
  </div>
</template>