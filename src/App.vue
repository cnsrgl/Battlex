<script>
//LocalStorage

//Import components and path..
import io from "socket.io-client";
import Characters from "@/components/Characters.vue";
import Chat from "@/components/Chat.vue";
import Othersvg from "@/components/Other-svg.vue";
import gsap from "gsap";
//Import components
//Sounds Game
const button = new Audio("./sounds/button.wav");
const call_war = new Audio("./sounds/call-war.wav");
const gol = new Audio("./sounds/game-over-lost.wav");
const wtg = new Audio("./sounds/winthisgame.ogg");
const BeastAttack = new Audio("./sounds/beast-attack.wav");
const burning = new Audio("./sounds/burning.wav");
const slash = new Audio("./sounds/slash.mp3");
BeastAttack.volume = 0.1;
//Sounds Game

export default {
  name: "App",
  data() {
    return {
      SOPlayers: "",
      leftbar: false,
      PlayersBar: false,
      isSounds: true,
      Notification: 0,
      //To remove the Attack button from the DOM at the end of the round.
      AttackBtnControl: true,
      //Public Path
      publicPath: process.env.BASE_URL,
      //Logs
      logs: [{ log: "" }],
      logsB: [{ log: "" }],

      CharacterID: 0,
      P1W: 100,
      P2W: 100,
      SaldirPuan: 0,
      CanavarSaldirPuan: 0,
      Sonuc: "",
      GameOver: false,
      ResultWin: false,
      ResultLose: false,
      ResultCss: "",
      Login: 0,
      Score1: 0,
      Score2: 0,
      Round: 1,

      RandomCss: "",
      IconQuestion: "?",

      RandomTop: 0,
      RandomLeft: 0,
      CanavarSaldirOto: false,
      CanavarHPOto: false,
      CHPO_Interval: null,
      CSO_Interval: null,
    
      //HELL ATTACK TIMER
      timerEnabled: false,
      timerCount: 10,
      TimerDisabledBtn: 0,
      //SLASH ATTACK TIMER
      timerEnabledS: false,
      timerCountS: 5,
      TimerDisabledBtnS: 0,
      //HEALTH TAKE TIMER
      timerEnabledH: false,
      timerCountH: 1,
      TimerDisabledBtnH: 0,
      //ATTACK TAKE TIMER
      timerEnabledA: false,
      timerCountA: 1,
      TimerDisabledBtnA: 0,
      //BEAST ATTACK TIMER
      timerEnabledBA: true,
      timerCountBA: 5,
      TimerDisabledBtnBA: 5,
      // Sounds
    };
  },
  components: {
    Characters,
    Othersvg,
    Chat,
  },
  computed: {
    OSPlayersFilter() {
      return this.$store.state.users.filter((user) =>
        user.name.toLowerCase().includes(this.SOPlayers.toLowerCase())
      );
    },
    PlayerName(){
      return this.$store.state.PlayerName
    }
  },
  methods: {
    StartInvitation(){
      alert("Deneme")
    },


    isSound() {
      if (this.isSounds == true) {
        this.isSounds = false;
        call_war.pause();
        gol.pause();
        wtg.pause();
        BeastAttack.pause();
        burning.pause();
        slash.pause();
      } else if (this.isSounds == false) {
        this.isSounds = true;
      }
    },
    ConnectionFriend() {
      var roomId = Math.floor(Math.random() * 999999999) + 1;
      if (!this.$store.state.socket.socket) {
        this.$store.state.socket.connect();
      }
      this.$store.state.socket.on("connection", function() {
        this.$store.state.socket.emit("room", roomId);
      });
    },
   
    ShowPlayersBar() {
      if (this.PlayersBar == true) {
        this.PlayersBar = false;
        gsap.to(".ResultOnlinePlayers", {
          duration: 0.1,
          x: "400",
          y: 0,
          ease: "power2",
        });
      } else if (this.PlayersBar == false) {
        this.PlayersBar = true;
        gsap.to(".ResultOnlinePlayers", {
          duration: 0.1,
          x: "0",
          y: 0,
          ease: "power2",
        });
      }
    },
    SlideMsgBox() {
      setTimeout(() => {
        var MsgBox = document.getElementById("MessagesPlayers");
        MsgBox.scrollTop = MsgBox.scrollHeight - 100;
      }, 300);
    },
    
    NextPage: function(page) {
      button.play();
      if (page == 1 && this.$store.state.PlayerName != "" && this.$store.state.PlayerName != " ") {
        //Sounds
        console.log(this.$store.state.PlayerName);
        this.$store.state.PlayerName = document.getElementById("textbox").value 
        localStorage.setItem("PlayerName", this.$store.state.PlayerName);
        button.play();
        //socket
        this.$store.state.socket.emit("new_user", this.$store.state.PlayerName);
        //socket
        return (this.Login = 1);
      } else if (page == 2) {
        button.play();
        return (this.Login = 2);
      } else if (page == 3) {
        button.play();
        call_war.currentTime = 0;
        if (this.isSounds == true) {
          call_war.play(); // Begin game
        }
        return (this.Login = 3);
      } else if (page == 4) {
        return (this.Login = 4);
      }
    },

    AttackKeyUp: function(e) {
      var keyCode = e.keyCode;
      if (keyCode == 49 && document.getElementById("Attack")) {
        document.getElementById("Attack").click();
      }
    },
    SlashKeyUp: function(e) {
      var keyCode = e.keyCode;
      if (keyCode == 51 && document.getElementById("SlashAttack")) {
        document.getElementById("SlashAttack").click();
      }
    },
    HPKeyUp: function(e) {
      var keyCode = e.keyCode;
      if (keyCode == 50 && document.getElementById("HP")) {
        document.getElementById("HP").click();
      }
    },
    HellKeyUp: function(e) {
      var keyCode = e.keyCode;
      if (keyCode == 52 && document.getElementById("HellAttack")) {
        document.getElementById("HellAttack").click();
      }
    },
    Attack: function() {
      document.getElementById("Attack").disabled = true;
      this.timerEnabledA = true;
      this.TimerDisabledBtnA = 1;
      this.SaldirPuan = Math.floor(Math.random() * 5) + 0;
      this.P1W = this.P1W - this.SaldirPuan;
      this.logsB.push({ log: this.SaldirPuan + " damage" });
      this.CanavarSaldirOto = true;
      this.CanavarHPOto = true;

      if (this.SaldirPuan == 0) {
        this.logsB.push({ log: "Miss" });
      }
    },
    hp: function() {
      document.getElementById("HP").disabled = true;
      this.timerEnabledH = true;
      this.SaldirPuan = 2;
      this.P2W = this.P2W + this.SaldirPuan;
      this.TimerDisabledBtnH = 1;
      this.logs.push({ log: "+ 5 life points" });
      3;
    },
    HellAttack: function() {
      document.getElementById("HellAttack").disabled = true;
      this.timerEnabled = true;
      this.SaldirPuan = Math.floor(Math.random() * 20) + 2;
      this.P1W = this.P1W - this.SaldirPuan;
      this.TimerDisabledBtn = 10;
      this.logsB.push({ log: this.SaldirPuan + " damage" });
      setTimeout(() => {}, 2000);
    },
    SlashAttack: function() {
      this.timerEnabledS = true;
      this.TimerDisabledBtnS = 5;
      document.getElementById("SlashAttack").disabled = true;
      this.SaldirPuan = Math.floor(Math.random() * 10) + 2;
      this.logsB.push({ log: this.SaldirPuan + " damage" });
      this.P1W = this.P1W - this.SaldirPuan;
    },
    ResultClose() {
      button.play();
      if (this.isSounds == true) {
        call_war.play();
      }
      this.ResultWin = false;
      this.ResultLose = false;
      this.ResultCss = "";
      document.getElementById("round").style.transform = "scale(1)";
      document.getElementById("round").style.background = "transparent";
      this.AttackBtnControl = true;
    },
    GameOverTrue() {
      button.play();
      this.ResultWin = false;
      this.ResultLose = false;
      this.GameOver = false;
      this.ResultCss = "";
      this.Score1 = 0;
      this.Score2 = 0;
      this.Round = 1;
      this.P1W = 100;
      this.P2W = 100;
      this.SaldirPuan = 0;
      this.CanavarSaldirPuan = 0;
      document.getElementById("round").style.transform = "scale(1)";
      document.getElementById("round").style.background = "transparent";
      this.AttackBtnControl = true;
      this.Login = 1;
    },

    ShowInfo() {
      if (this.IconQuestion === "?") {
        this.IconQuestion = "x";
      } else {
        this.IconQuestion = "?";
      }
    },
  },
  mounted() {
    // GSAP Config
    gsap.config({
      nullTargetWarn: false,
    });

   document.getElementById('textbox').value = localStorage.getItem("PlayerName")

    // Socket.io Config
    this.$store.state.socket = io("http://178.193.216.170:3333/");
    this.$store.state.socket.on("users", (data) => {
      this.$store.users = data;
    });
    // Return Messages on server
    
    // Keyboard Event
    window.addEventListener("keyup", this.AttackKeyUp);
    window.addEventListener("keyup", this.HellKeyUp);
    window.addEventListener("keyup", this.HPKeyUp);
    window.addEventListener("keyup", this.SlashKeyUp);
    // Animations
    gsap.from(".main-logo", {
      duration: 0.5,
      scale: 5,
    });
    gsap.set(".NicknameScreen", { scale: 0 });
    var NicknameScreen = gsap.timeline({});
    NicknameScreen.to(".NicknameScreen", {
      duration: 0.5,
      stagger: { from: "end", amount: 1.5 },
      y: 10,
      scale: 1,
    });
  },
  watch: {
    CanavarSaldirOto: function(value) {
      if (value == true) {
        this.CSO_Interval = setInterval(() => {
          // this.ShowDmg1 = true;
          if (this.isSounds == true) {
            BeastAttack.play();
          }
          // this.RandomPosition();
          this.CanavarSaldirPuan = Math.floor(Math.random() * 11) + 0;
          if (this.P2W > 0) {
            this.P2W = this.P2W - this.CanavarSaldirPuan;
            this.logs.push({ log: this.CanavarSaldirPuan + " - It hit you" });
            document.getElementById("Sword_2").style.animationPlayState =
              "running";
            document.getElementById("Sword_2_10").style.animationPlayState =
              "running";
            document.getElementById("hearth_4").style.animationPlayState =
              "running";
          }
          if (this.CanavarSaldirPuan === 0) {
            this.logs.push({ log: "Miss" });
          }
        }, 1000);
      } else {
        clearInterval(this.CSO_Interval);
        document.getElementById("Sword_2").style.animationPlayState = "paused";
        document.getElementById("Sword_2_10").style.animationPlayState =
          "paused";
        document.getElementById("hearth_4").style.animationPlayState = "paused";
        this.CanavarSaldirOto = false;
      }
    },
    CanavarHPOto: function(value) {
      if (value == true && this.P1W <= 100) {
        this.CHPO_Interval = setInterval(() => {
          this.logsB.push({
            log: "+ " + this.CanavarSaldirPuan + " life points",
          });
          this.CanavarSaldirPuan = Math.floor(Math.random() * 4) + 1;
          if (this.P1W > 0) {
            this.P1W = this.P1W + this.CanavarSaldirPuan;
            document.getElementById("Sword_2").style.animationPlayState =
              "running";
            document.getElementById("Sword_2_10").style.animationPlayState =
              "running";
          }
        }, 2000);
      } else {
        clearInterval(this.CHPO_Interval);
        document.getElementById("Sword_2").style.animationPlayState = "paused";
        document.getElementById("Sword_2_10").style.animationPlayState =
          "paused";
        this.CanavarHPOto = false;
      }
    },

    //* Player main
    P2W: function(value) {
      if (value <= 0) {
        this.P2W = 0;
        this.AttackBtnControl = false;
        if (this.isSounds == true) {
          gol.play();
        }
        this.timerEnabledA = false;
        this.timerEnabledS = false;
        this.timerEnabled = false;
        this.timerEnabledH = false;

        this.ResultCss =
          "z-index: 12;background-color: #f44336; transform:scale(1)";
        this.Sonuc = this.Round + ".Round - You Lost";
        this.ResultLose = true;
        document.getElementById("round").style.transform = "scale(15)";
        document.getElementById("round").style.background = "black";
        this.CanavarSaldirOto = false;
        this.CanavarHPOto = false;
        this.SaldirPuan = 0;
        this.CanavarSaldirPuan = 0;
        this.P1W = 100;
        this.P2W = 100;
        this.logs = [];
        this.logsB = [];
        this.RandomCss = "";
        this.RandomTop = 0;
        this.RandomLeft = 0;
        this.Round++;
        this.Score2++;
        console.log("Kaybettin");
      } else if (value >= 100) {
        this.P2W = 100;
      }
    },

    //! Beast
    P1W: function(value) {
      if (value <= 0) {
        this.P1W = 0;
        this.AttackBtnControl = false;
        if (this.isSounds == true) {
          wtg.play();
        }
        this.timerEnabledA = false;
        this.timerEnabledS = false;
        this.timerEnabled = false;
        this.timerEnabledH = false;
        this.ResultWin = true;
        this.ResultCss =
          "z-index: 12;background-color: #4caf50; transform:scale(1)";
        this.Sonuc = this.Round + ".Round - You Win";
        document.getElementById("round").style.transform = "scale(15)";
        document.getElementById("round").style.background = "black";
        this.CanavarSaldirOto = false;
        this.CanavarHPOto = false;
        this.SaldirPuan = 0;
        this.CanavarSaldirPuan = 0;
        this.P1W = 100;
        this.P2W = 100;
        this.logs = [];
        this.logsB = [];
        this.RandomCss = "";
        this.RandomTop = 0;
        this.RandomLeft = 0;
        this.Round++;
        this.Score1++;
        console.log("Kazandın");
      } else if (value >= 100) {
        this.P1W = 100;
      }
    },

    // !HellTiming
    timerEnabled(value) {
      if (value) {
        if (this.isSounds == true) {
          burning.play();
        }
        setTimeout(() => {
          this.timerCount--;
        }, 1000);
      }
    },

    timerCount: {
      handler(value) {
        if (value > 0 && this.timerEnabled) {
          setTimeout(() => {
            this.timerCount--;
            this.TimerDisabledBtn -= 1;
          }, 1000);
        } else {
          this.timerCount = 10;
          this.timerEnabled = false;
          this.TimerDisabledBtn = 0;
          if (document.getElementById("HellAttack")) {
            document.getElementById("HellAttack").disabled = false;
          }
        }
      },
    },
    // !HellTiming
    // !SlashTiming
    timerEnabledS: function(value) {
      if (value) {
        if (this.isSounds == true) {
          slash.play();
        }
        setTimeout(() => {
          this.timerCountS--;
        }, 1000);
      }
    },
    timerCountS: {
      handler(value) {
        if (value > 0 && this.timerEnabledS) {
          setTimeout(() => {
            this.timerCountS--;
            this.TimerDisabledBtnS -= 1;
          }, 1000);
        } else {
          this.timerCountS = 5;
          this.timerEnabledS = false;
          this.TimerDisabledBtnS = 0;
          if (document.getElementById("SlashAttack")) {
            document.getElementById("SlashAttack").disabled = false;
          }
        }
      },
    },
    // !SlashTiming
    // !HP Timing

    timerEnabledH: function(value) {
      if (value) {
        var hpup = new Audio("./sounds/hp.wav");
        if (this.isSounds == true) {
          hpup.play();
        }
        setTimeout(() => {
          this.timerCountH--;
        }, 1000);
      }
    },

    timerCountH: {
      handler(value) {
        if (value > 0 && this.timerEnabledH) {
          setTimeout(() => {
            this.timerCountH--;
            this.TimerDisabledBtnH -= 1;
          }, 1000);
        } else {
          this.timerCountH = 1;
          this.timerEnabledH = false;
          this.TimerDisabledBtnH = 0;
          if (document.getElementById("HP")) {
            document.getElementById("HP").disabled = false;
          }
        }
      },
    },
    // !HP Timing
    // !Attack Timing Start
    timerEnabledA: function(value) {
      if (value) {
        if (this.isSounds == true) {
          var attack_default = new Audio("./sounds/attack.wav");
          attack_default.play();
        }
        setTimeout(() => {
          this.timerCountA--;
        }, 1000);
      }
    },
    timerCountA: {
      handler(value) {
        if (value > 0 && this.timerEnabledA) {
          setTimeout(() => {
            this.timerCountA--;
            this.TimerDisabledBtnA -= 1;
          }, 1000);
        } else {
          this.timerCountA = 1;
          this.timerEnabledA = false;
          this.TimerDisabledBtnA = 0;
          if (this.AttackBtnControl == true) {
            document.getElementById("Attack").disabled = false;
          }
        }
      },
    },
    // *GAME OVER BEGIN* //
    Score1: function(say) {
      if (say == 3) {
        console.log("Oyunu Kazandın. Skorun: " + this.Score1);
        if (this.isSounds == true) {
          wtg.play();
        }
        this.ResultWin = false;
        this.GameOver = true;
        this.ResultCss =
          "z-index: 12;background-color: #4caf50; transform:scale(1)";
        this.Sonuc = "✌️❤️ You defeated the monster ❤️✌️";
      }
    },
    Score2: function(say) {
      if (say == 3) {
        console.log("Oyunu Kaybettin. Skorun: " + this.Score2);
        if (this.isSounds == true) {
          gol.play();
        }
        this.ResultLose = false;
        this.GameOver = true;
        this.ResultCss =
          "z-index: 12;background-color: #380c44; transform:scale(1)";
        this.Sonuc = " 🖕👹 The monster slapped you 👹🖕 ";
      }
    }, // *GAME OVER END* //
  },
};
</script>

<template>
  <div class="stars">
    <div v-for="index in 10" :key="index" class="star"></div>
  </div>
  <nav v-if="Login != 0" class="nav">
    <div class="HeaderButtons" style="justify-content: flex-start;">
      <button v-if="Login != 3" class="BackIcon" @click="Login--">
        <span><Othersvg name="IconBack" /> </span>
      </button>
      <button class="HowToPlay" @click="ShowInfo()">
        <span>{{ IconQuestion }}</span>
      </button>
    </div>
    <div>
      <img
        v-if="Login != 0 && Login != 3"
        class="logo"
        src="/img/logo.svg"
        alt="Logo"
      />
      <div v-if="Login == 3" class="score">
        <Othersvg name="ScoreBar" />
        <span class="belirt">
          <span class="skor1">{{ Score1 }}</span>
          <span class="skor2">{{ Score2 }}</span>
        </span>
        <span id="round"
          >Round: <strong>{{ Round }}</strong></span
        >
      </div>
    </div>
    <div class="HeaderButtons">
      <button v-if="isSounds == true" class="IconSounds" @click="isSound()">
        <span><Othersvg name="IconVolUp"/></span>
      </button>
      <button v-else class="IconSounds" @click="isSound()">
        <span><Othersvg name="IconVolOff"/></span>
      </button>
      <button class="OnlinePlayersBtn" @click="ShowPlayersBar()">
        <span><Othersvg name="IconOnUser"/></span>
      </button>
    </div>
    <div
      v-if="IconQuestion === 'x'"
      class="Result"
      style="
        z-index: 10;
        background-color: rgb(46 18 72 / 95%);
        transform: scale(1);
      "
    >
      <p>How to Play ?</p>
      <p>
        <Othersvg name="Keyboard" />
      </p>
    </div>

    <!--  List Connected People -->
    <div class="ResultOnlinePlayers">
      <div id="ChatHead">Online Players</div>
      <input
        placeholder="Search"
        class="SOPlayers"
        type="text"
        v-model="SOPlayers"
      />
      <div class="UsersFlex">
        <div
          class="UsersFlexFor"
          v-for="user in OSPlayersFilter"
          :key="user.id"
        >
          <div class="OnlineUsers">{{ user.name }}</div>
          <Othersvg @click="StartInvitation()" class="AddUsers" name="IconAddUser" />
        </div>
      </div>
      <div
        id="ChatHead"
        style="color: #5089c6; border-bottom: 1.5pt solid #5089c6"
      >
        Your friends
      </div>
      <div class="UsersFlex">
        <div class="UsersFlexFor" v-for="user in users" :key="user.id">
          <div class="OnlineUsers" style="background-color: #5089c6">
            {{ user.name }}
          </div>
          <Othersvg
            class="AddUsers"
            style="background-color: #035397"
            name="IconPlay"
          />
        </div>
      </div>
    </div>
    <!--  List Connected People -->
  </nav>
  <!--! Nickname Screen-->

  <div v-if="Login == 0" class="NicknameScreen">
    <img class="main-logo" src="/img/logo.svg" alt="" />
    <div class="welcome">Welcome</div>
    <form class="FormFlex" @submit.prevent="NextPage(1)">
      <input
        id="textbox"
        maxlength="12"
        class="textbox"
        type="text"
        placeholder="Write Nickname"
      />
      <button v-if="PlayerName !== ''" id="Basla">Next</button>
      <button v-else id="Basla" disabled>Next</button>
    </form>
  </div>
  <!--! Nickname Screen-->

  <Chat />
  <div v-if="Login == 1" class="ChooseScreen">
    <div class="BtnFlex">
      <button @keyup.enter="NextPage(2)" id="SingleBtn" @click="NextPage(2)">
        <p>training</p>
      </button>
      <button @keyup.enter="NextPage(4)" id="MultiBtn" @click="NextPage(4)">
        <p>Multiplayers</p>
      </button>
    </div>
  </div>
  <!-- Begin Choose your warrior screen-->
  <div v-if="Login == 2" class="ChooseScreen">
    <div class="welcome">Choose your character</div>
    <div class="CharactersFlx">
      <div class="Characters">
        <Characters
          tabindex="1"
          @click="CharacterID = 1"
          name="Ch_A"
        /><!-- Component -->
      </div>
      <div class="Characters">
        <Characters
          tabindex="2"
          @click="CharacterID = 2"
          name="Ch_B"
        /><!-- Component -->
      </div>
      <div class="Characters">
        <Characters
          tabindex="3"
          @click="CharacterID = 5"
          name="Ch_E"
        /><!-- Component -->
      </div>
      <span class="Characters">
        <Characters
          tabindex="4"
          @click="CharacterID = 3"
          name="Ch_C"
        /><!-- Component --></span
      >
      <div class="Characters">
        <Characters
          tabindex="5"
          @click="CharacterID = 4"
          name="Ch_D"
        /><!-- Component -->
      </div>
      <span class="Characters"
        ><Characters
          tabindex="6"
          @click="CharacterID = 6"
          name="Ch_F"
        /><!-- Component -->
      </span>
      <div class="Characters">
        <Characters
          tabindex="7"
          @click="CharacterID = 7"
          name="Ch_G"
        /><!-- Component -->
      </div>
      <div class="Characters">
        <Characters
          tabindex="8"
          @click="CharacterID = 8"
          name="Ch_H"
        /><!-- Component -->
      </div>
      <div class="Characters">
        <Characters
          tabindex="9"
          @click="CharacterID = 9"
          name="Ch_I"
        /><!-- Component -->
      </div>
      <div class="Characters">
        <Characters
          tabindex="10"
          @click="CharacterID = 10"
          name="Ch_J"
        /><!-- Component -->
      </div>
    </div>
    <button
      @keyup.enter="NextPage(3)"
      v-if="CharacterID > 0"
      id="Basla"
      @click="NextPage(3)"
    >
      Start
    </button>
    <button v-else id="Basla" disabled>Start</button>
  </div>
  <!--********************************************************************** Finish Choose your warrior screen-->
  <div class="Result" :style="ResultCss">
    <div class="win">
      <p>{{ Sonuc }}</p>
      <button v-if="ResultWin" class="PlayNextRound" @click="ResultClose">
        Play next round
      </button>
      <button
        v-else-if="ResultLose"
        class="PlayNextRoundLose"
        @click="ResultClose"
      >
        Play next round
      </button>
      <button v-else-if="GameOver" class="PlayAgain" @click="GameOverTrue">
        PlayAgain
      </button>
    </div>
  </div>

  <div v-if="Login == 3" class="players">
    <div class="MainPlayer">
      <p>{{ PlayerName }}</p>
      <div v-if="CharacterID == 1" class="Damage">
        <Characters name="Ch_A" />
      </div>
      <div v-if="CharacterID == 2" class="Damage">
        <Characters name="Ch_B" />
      </div>
      <div v-if="CharacterID == 3" class="Damage">
        <Characters name="Ch_C" />
      </div>
      <div v-if="CharacterID == 4" class="Damage">
        <Characters name="Ch_D" />
      </div>
      <div v-if="CharacterID == 5" class="Damage">
        <Characters name="Ch_E" />
      </div>
      <div v-if="CharacterID == 6" class="Damage">
        <Characters name="Ch_F" />
      </div>
      <div v-if="CharacterID == 7" class="Damage">
        <Characters name="Ch_G" />
      </div>
      <div v-if="CharacterID == 8" class="Damage">
        <Characters name="Ch_H" />
      </div>
      <div v-if="CharacterID == 9" class="Damage">
        <Characters name="Ch_I" />
      </div>
      <div v-if="CharacterID == 10" class="Damage">
        <Characters name="Ch_J" />
      </div>

      <div class="ProgressBarSBg">
        <span class="Usstekal">{{ P2W }} </span>
        <div v-if="P2W > 0" class="ProgressBarM" :style="{ width: P2W + '%' }">
          <!-- !HP svg-->
          <Othersvg name="HealthSvg" />
        </div>
        <div v-else class="ProgressBarM" :style="{ width: P2W + '%' }"></div>
      </div>
      <div class="reverseLog">
        <span v-for="(log, index) in logs.slice(-3)" :key="index" class="RedCP">
          {{ log.log }}
        </span>
      </div>
    </div>
    <div class="sword">
      <!-- !sword svg-->
      <img v-if="Login == 3" class="logoPlay" src="/img/logo.svg" alt="Logo" />
      <Othersvg name="Swords" />
    </div>
    <div class="SecondePlayer">
      <p>Beast</p>
      <div v-if="timerEnabled" id="flame">
        <div class="fire-wrapper">
          <div
            v-for="FireElement in 15"
            :key="FireElement"
            class="fire-element"
          ></div>
        </div>
      </div>
      <span class="DamageBeast">
        <Othersvg name="Beast1" />
      </span>
      <div class="ProgressBarSBg">
        <span class="Usstekal">{{ P1W }} </span>
        <div v-if="P1W > 0" class="ProgressBarS" :style="{ width: P1W + '%' }">
          <!-- Hearth svg -->
          <Othersvg name="HealthSvg" />
        </div>
        <div v-else class="ProgressBarS" :style="{ width: P1W + '%' }"></div>
      </div>
      <div class="reverseLog">
        <span
          v-for="(log, index) in logsB.slice(-3)"
          :key="index"
          class="RedCP"
        >
          {{ log.log }}
        </span>
      </div>
    </div>
  </div>
  <div v-if="Login == 3" class="buttons">
    <!-- Saldırı Butonu -->
    <div class="bgpower">
      <span v-show="TimerDisabledBtnA > 0" class="ButtonTime">
        {{ TimerDisabledBtnA }}
      </span>
      <button v-if="AttackBtnControl" id="Attack" @click="Attack"></button>
    </div>
    <div class="bgpower">
      <span v-if="TimerDisabledBtnH > 0" class="ButtonTime">
        {{ TimerDisabledBtnH }}
      </span>
      <button v-if="CanavarSaldirOto" id="HP" @click="hp"></button>
    </div>
    <div class="bgpower">
      <span v-if="TimerDisabledBtnS > 0" class="ButtonTime">
        {{ TimerDisabledBtnS }}
      </span>
      <button v-if="CanavarSaldirOto" id="SlashAttack" @click="SlashAttack">
        Slash
      </button>
    </div>
    <div class="bgpower">
      <span v-if="TimerDisabledBtn > 0" class="ButtonTime">
        {{ TimerDisabledBtn }}
      </span>
      <button v-if="CanavarSaldirOto" id="HellAttack" @click="HellAttack">
        Hell
      </button>
    </div>
    <div class="bgpower">
      <!-- Resetleme Butonu -->
      <button class="Restart">Restart</button>
      <!-- Resetleme Butonu -->
    </div>
  </div>
</template>
